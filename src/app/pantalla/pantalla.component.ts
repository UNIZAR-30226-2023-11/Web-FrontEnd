import {Component, OnInit} from '@angular/core';
import { UserService } from 'app/user/user.service';
import {Router, ActivatedRoute, NavigationExtras} from "@angular/router";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})

export class PantallaComponent implements OnInit{

  username: string | null;
  id_partida_nueva: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: WebSocketService,
  ) {
  }
  
// función que permite volver arriba en la página
volverArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  ngOnInit() {
    this.socketService.soyInvitado = false;
    // Get username from browser
    //this.username = localStorage.getItem('username');
    this.socketService.consultarUsuario()
    .then ((usuario: any) => {
      console.log("usuario: ", usuario);
      this.username = usuario.msg.nombreUser;
      this.socketService.username = usuario.msg.nombreUser; 
      if (this.username == null) {
        this.router.navigate(['/error']);
      }
    })
    .catch(() => {
      console.log("ERROR AL OBTENER NOMBRE USUARIO");
    });
  }

  crearPartida() {
    console.log("CREAR PARTIDA BOTON PANTALLA");
    
    this.socketService.crearPartida({
      dineroInicial: 1000,
      nJugadores: 2,
      normas: {cobrarCarcel: false, cobrarBeca: false, activarSubasta: false, aumentarCreditos: false, reiniciarJuegoBancarrota: false},
      socketId: this.socketService.socketID
    })
        .then((crearSala: number) => {
          if(crearSala != -1){
            console.log("CREAR SALA: ", crearSala);
            this.socketService.idPartida = crearSala;
            this.router.navigate(['/crear_sala']);
          }
        })
        .catch(() => {
          console.log("ERROR AL CREAR SALA");
        });
  }
}
