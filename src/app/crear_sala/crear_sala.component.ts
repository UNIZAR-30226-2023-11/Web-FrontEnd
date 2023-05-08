import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { DatosSalaService } from 'app/user/datos.service';
import { WebSocketService } from 'app/web-socket.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  private router: Router | null = null;
  numJugadores: number = 2; 
  dineroJugador: number = 1000;
  username: string;
  normas: boolean[] = [];
  idPartida: number;
  current_player: string;
  players_list: [string, number][] = [];
  interval: any;
  jugadoresConectados: string[] = [];
  cobrarCarcel: boolean = false;
  cobrarBeca: boolean = false;
  activarSubasta: boolean = false;
  aumentarCreditos: boolean = false;
  reiniciarJuegoBancarrota: boolean = false;  
  list_players: string[] = [];
  partidaCreadaBoton: boolean = false;

  constructor(
    router: Router,
    private gameService: GameService,
    private userService: UserService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private elRef: ElementRef,
    private datosSalaService: DatosSalaService,
    private socketService: WebSocketService,
    private location: Location
  ){
    this.router = router;
    this.username = socketService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
    const checkbox = document.querySelector('input[data-var=cobrarCarcel]') as HTMLInputElement;
    checkbox?.addEventListener('change', (event: Event) => {
    this.cobrarCarcel = (event.target as HTMLInputElement).checked;
  });
  }

  ngOnInit() {
    let username = this.socketService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
    console.log("ME HE ADELANTADO");
    this.idPartida = this.socketService.idPartida;
    console.log("ID PARTIDA: ", this.idPartida);
    console.log("LEER USUARIOS");

    this.socketService.actualizarUsuariosConectados()
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });
    console.log("--", this.list_players);
  }

  empezarJugar() {
    console.log("nos vamos al board");
    this.actualizarDatos();
    const datos = {
      dineroInicial: this.dineroJugador,
      nJugadores: this.numJugadores,
      normas: {
        cobrarCarcel: this.cobrarCarcel,
        cobrarBeca: this.cobrarBeca,
        activarSubasta: this.activarSubasta,
        aumentarCreditos: this.aumentarCreditos,
        reiniciarJuegoBancarrota: this.reiniciarJuegoBancarrota
      },
      socketId: this.socketService.socketID     
    };
    console.log("CONFIGURACIÓN CREAR PARTIDA: ", datos);
    if(this.router!=null){
      const ruta = '/game/' + this.idPartida;
      this.router.navigateByUrl(ruta);
    }
    //this.userService.crearSala(datos);
    /*this.socketService.crearSala(datos)
        .then((crearSala: number) => {
          console.log("CREAR SALA: ", crearSala);
          this.idPartida = crearSala;
          this.socketService.actualizarUsuariosConectados();
        })
        .catch(() => {
          console.log("ERROR AL CREAR SALA");
        });
        
    

    async  leerJugadores(){
       this.socketService.actualizarUsuariosConectados()
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });
    console.log("USUARIOS LEIDOS");*/
  }
  actualizarDatos(){
    console.log("ACTUALIZAR DATOS");
    const datos = { nJugadores: this.numJugadores, dineroInicial: this.dineroJugador, socketId: this.socketService.socketID };
    this.socketService.actualizarDatosCrearPartida(datos);
    console.log(this.numJugadores, this.dineroJugador);
  }

  incrementarDinero() {
    if (this.dineroJugador + 500 <= 3000) {
      this.dineroJugador += 500;
    }
    this.actualizarDatos();
  }

  decrementarDinero() {
    if (this.dineroJugador - 500 >= 1000) {
      this.dineroJugador -= 500;
    }
    this.actualizarDatos();
  }


}
