import {Component, Input, EventEmitter, Output } from '@angular/core';
import {GameService} from "../../game/game.service";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-interaction-card',
  templateUrl: './interaction-card.component.html',
  styleUrls: ['./interaction-card.component.css']
})
export class InteractionCardComponent {

  botonPulsado: boolean = false;

  @Input() h : number;
  @Input() v : number;
  @Input() game_id : number = 0;
  @Input() type : string = "buy";
  @Input() amount_to_pay : number = 0;
  @Input() username : string;
  @Input() player_money : number = 0;
  @Input() message: string;
  @Input() play_again: boolean = false;
  @Input() trigger_end_turn: boolean = true;
  @Input() is_playing: boolean = false;

  // Define an EventEmitter to emit the "end turn" event of BoardComponent
  @Output() end_turn = new EventEmitter();
  @Output() close_card = new EventEmitter();
  @Output() update_player_info = new EventEmitter();

  constructor(
    private socketService: WebSocketService
  ) {

  }

  get_type_casilla() {

    if (this.h == 5 || this.v == 5){
      return "party";
    }
    else if (this.h == 0 && this.v == 8){
      return "electricity"
    }
    else if (this.h == 8 && this.v == 0){
      return "heat";
    }
    else{
      return "propriety";
    }
  }

  buy_card() {
    this.botonPulsado = true;
    console.log("ENTRA A COMPRAR CASILLA");
    this.socketService.comprarCasilla({ socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .subscribe({
      next: (ack: any) => {
        console.log("ack: " + ack);
        if(ack.cod == 1){
          console.log("no se ha encontrado");
        } else if(ack.cod == 2){
          console.log("error en la funcion");
        } else if(ack.cod == 6 || ack.cod == 7){
          console.log("Has comprado la casilla");
          
        } else if(ack.cod == 9){
          console.log("No tienes dinero suficiente para comprarla");
        }
      },
      complete: () => {
        // Callback function to come back to board
        this.callback();
      }
    });
    this.botonPulsado = false;
  }

  increase_credit_property(): void {
    this.botonPulsado = true;
    this.socketService.aumentarCreditos({ socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .subscribe({
      next: (ack: any) => {
        if(ack.cod == 0){
          console.log("You have increased the card");
          console.log(ack);
        } else if(ack.cod == 1){
          console.log("no se ha encontrado");
          alert("No se ha encontrado la casilla");
        } else if(ack.cod == 2){
          console.log("error en la funcion");
          alert("Error en la función");
        }
      },
      complete: () => {
        this.callback();
      }
    });
    this.botonPulsado = false;
  }

  pay_card() {
    this.botonPulsado = true;
    // Call end turn of BoardComponent
    console.log("You have paid");
    this.botonPulsado = false;
    this.callback();
  }

  sell_card() : void {
    this.botonPulsado = true;
    this.socketService.vender({socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .subscribe({
      next: (ack: any) => {
        console.log("Has vendido la casilla");
        console.log(ack);
        if(ack.cod == 0){
          console.log("You have sold the card");
          // Update properties of player
          this.update_player_info.emit();
        }
        else if(ack.cod == 1){
          console.log("no se ha encontrado");
          alert("No se ha encontrado la casilla");
        }
        else if(ack.cod == 2){
          console.log("error en la funcion");
          alert("Error en la función");
        }
      },
      complete: () => {
        console.log("Has vendido la casilla");
        this.callback();
      }
    });
    this.botonPulsado = false;
  }

  callback(){
    this.botonPulsado = false;
    console.log("callback");
    this.update_player_info.emit();
    if (this.trigger_end_turn) {
      this.end_turn.emit();
    }
    else {
      this.close_card.emit();
    }
  }
}
