import {Component} from '@angular/core';
import { UserService } from 'app/user/user.service';
import { WebSocketService } from 'app/web-socket.service';
import * as yup from 'yup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-pantalla_invitado',
  templateUrl: './pantalla_invitado.component.html',
  styleUrls: ['./pantalla_invitado.component.css']
})

export class PantallaInvitadoComponent {
  form_unirse_invitado: FormGroup;
  username: string;
  id_partida_nueva: number;

  constructor(
    //private userService: UserService,
    private fb: FormBuilder,
    private socketService: WebSocketService
    
  ) {
    this.form_unirse_invitado = this.fb.group({
      username: ['', [Validators.required, this.customValidation]],
    });
  }

  ngOnInit() {
    // If user is already logged in, redirect to home
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required()
    });
    this.form_unirse_invitado.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }

  crearSala(){
    /*console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.valid, this.form_unirse_invitado.value.username);
    if(this.form_unirse_invitado.valid){
      console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.value.username);
      const user = {username: this.form_unirse_invitado.value.username, socketId: this.socketService.socketID};
      this.socketService.crearSalaInvitado(user)
        .then((response: boolean) => {
          console.log("Respuesta crear sala: ", response);
        })
        .catch(() => {
          console.log("ERROR crear sala invitado");
        }
      );
    }*/
    if(this.form_unirse_invitado.valid){
      console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.value.username);
      //this.datosUser.usrename = this.form_unirse_invitado.value.username;
      //this.datosUser.idSocket = this.socketService.socketID;
      
    }
  }

  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  customValidation(control: any) {
    const value = control.value;
    if (value.trim() === '') {
      return { 'emptyValue': true };
    }
    return null;
  }
}
