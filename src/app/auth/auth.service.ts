import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiLoginBody, ApiLoginResponse, LoginFormResponse } from '../login/login.types';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedIn = false;
  baseUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {
    if (isDevMode()) {
      this.baseUrl = environment.baseUrlLocalhost;
    } else {
      this.baseUrl = environment.baseUrl;
    }
  }

  async doLogin(loginBody: ApiLoginBody): Promise<LoginFormResponse> {
    try {
      const apiLoginResponse: ApiLoginResponse = await this.login(loginBody);
      const token: string = apiLoginResponse.token;
      const nick: string = apiLoginResponse.user_nick;
      const verifyResponse: any = await this.verify(token);

      if (verifyResponse.admin) {
        this._loggedIn = true;
        sessionStorage.setItem('api-key',token)
        this.router.navigate(['users']);
        return {
          admin: verifyResponse.admin,
          result: `Login de administrador correcto => ${nick}`
        };
      } else {
        return {
          admin: verifyResponse.admin,
          error: verifyResponse.error
        };
      }
    } catch (error) {
      console.error('Error en doLogin:', error);
      return {
        admin: false,
        error: 'Error en la autenticación'
      };
    }
  }

  //respuestas
  private login(loginBody: ApiLoginBody): Promise<ApiLoginResponse> {
    return new Promise((resolve, reject) => {
      const loginUrl: string = `${this.baseUrl}${environment.authRoute}`;

      this.http.post<ApiLoginResponse>(loginUrl, loginBody).pipe(
        catchError((e) => {
          if (isDevMode()) {
            console.error(`Error al hacer login ${e.message}`);
          }
          return throwError(`Error al hacer login ${e.message}`);
        })
      ).subscribe(
        (response) => {
          console.log(response);
          resolve(response);
        },
        (error) => {
          console.error('Error en login:', error);
          resolve(error);
        }
      );
    });
  }


  private verify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const verifyUrl: string = `${this.baseUrl}verify`;
      const headers: HttpHeaders = new HttpHeaders().set('api-key', token);

      this.http.post<any>(verifyUrl, undefined, { headers: headers }).pipe(
        catchError((e) => {
          if (isDevMode()) {
            console.error(`Error al verificar token ${e.message}`);
          }
          return throwError(`Error al hacer login ${e.message}`);
        })
      ).subscribe(
        (response) => {
          console.log(response);
          resolve(response);
        },
        (error) => {
          console.error('Error en verify:', error);
          resolve({ admin: false, error: 'No tienes permisos de administrador' });
        }
      );
    });
  }


  public logOut(): void {
    this._loggedIn = false;
  }

  public isLoggedIn(): boolean {
    return this._loggedIn;
  }
}
