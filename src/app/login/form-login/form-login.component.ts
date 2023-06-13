import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiLoginBody, ApiLoginResponse } from '../login.types';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
})
export class FormLoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  error: boolean = false;
  errorMessage: string = '';
  userData?: ApiLoginResponse;

  email: string = '';
  password: string = '';

  public onSubmit(event: any) {
    event.preventDefault();
    this.email = event.target.elements.email.value;
    this.password = event.target.elements.password.value;
    const loginBody: ApiLoginBody = {
      email: this.email,
      passwd: this.password,
    };
    this.authService.doLogin(loginBody).subscribe(
      (userData: ApiLoginResponse) => {
        this.userData = userData;
        if (!userData.admin) {
          this.error = true;
          this.errorMessage = 'No tienes permisos de administrador';
        }
        if (this.authService.isLoggedIn()) {
          this.router
            .navigate(['/users'])
            .then(() => {
              console.log('Cambiando de pagina...');
            })
            .catch((error) => {
              console.error('Error al navegar:', error);
            });
        }
      },
      (error) => {
        //recoje la respuesta de error de la api
        const errorResponse = error.error?.error;
        if (errorResponse.result == 'error') {
          //muestra el mensaje de error en el login
          this.error = true;
          this.errorMessage = errorResponse.details;
        } else {
          //si no se conoce el error muestra uno generico
          this.error = true;
          this.errorMessage = 'Ha ocurrido algun error al hacer login';
        }
      }
    );
  }
}
