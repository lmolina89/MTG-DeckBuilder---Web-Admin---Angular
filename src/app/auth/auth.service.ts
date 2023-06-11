import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiLoginBody, ApiLoginResponse } from '../login/login.types';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;
  private baseUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {
    if (isDevMode()) {
      this.baseUrl = environment.baseUrlLocalhost;
    } else {
      this.baseUrl = environment.baseUrl;
    }
  }

  doLogin(loginBody: ApiLoginBody): void {
    let loginUrl: string = `${this.baseUrl}${environment.authRoute}`;

    this.http.post<ApiLoginResponse>(loginUrl, loginBody).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al hacer login ${e.message}`);
        }
        return throwError(`Error al hacer login ${e.message}`);
      })
    ).subscribe((userData) => {
      console.log(userData)
      if (userData.admin == true) {
        this.loggedIn = true;
        sessionStorage.setItem('api-key', userData.token);
      }
      if (this.isLoggedIn()) {
        this.router.navigate(['/users'])
          .then(() => {
            console.log('Cambiando de pagina...');
          })
          .catch(error => {
            // Manejo de errores durante la navegación
            console.error('Error al navegar:', error);
          });
      }
    });
  }


  public logOut(): void {
    this.loggedIn = false;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
