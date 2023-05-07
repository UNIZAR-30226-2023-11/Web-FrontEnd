import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-cambiar_correo_usuario',
  templateUrl: './cambiar_correo_usuario.component.html',
  styleUrls: ['./cambiar_correo_usuario.component.css']
})

export class CambiarCorreoComponent {
  form: FormGroup;
  username: string;
  old_email: string | null = null;
  loading = true;
  //new_email: string;
  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private router: Router
  ){
    this.form = this.fb.group({
      new_email: ['', [Validators.email, Validators.required]]
    });
    this.username = userService.getUsername();
    userService.leer_email({username: this.username})
    .subscribe(
      (response) => {
        console.log(response.body);
        userService.setEmail(response.body?.email ?? '');
        this.old_email = userService.getEmail();
        console.log(this.old_email);
        this.loading = false;
        //this.router.navigate(['/ajustes_usuario']);
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );  
    
    //this.old_email = this.route.snapshot.paramMap.get('email') ?? 'correo';
  }

  get new_email() {
    return this.form.get('new_email');
  }
  ngOnInit(): void {
    
  } 
  /*leer_email(){
    return (this.userService.leer_email(this.username)).toString();
  }*/
  guardar_nuevo_correo(){
    //this.email = (this.userService.leer_email(this.username)).toString();
    console.log(this.old_email);
    const user = {username: this.username, email: this.form.value.new_email};
    console.log(user);
    this.userService.guardar_nuevo_correo(user);
  }
}