import { Injectable, isDevMode } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { enviroment } from '../enviroments/enviroment';
import { ApiAuthBody, ApiAuthResponse } from '../login/login.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variable boolean para identificar si esta logeado
  private loggedIn = false;
  //url base de la api
  baseUrl: string = enviroment.baseUrl;

  constructor(private http: HttpClient) {}

  doLogin(email: string, password: string): void {
    const headers = new HttpHeaders({
      'Origin': 'http://localhost:4200',
    });

    const loginBody: ApiAuthBody = {
      email: email,
      passwd: password,
    };
    let loginUrl: string = `${this.baseUrl}${enviroment.authRoute}`;
    console.log(loginBody);

    this.http.post('api/api-users/endp/auth',loginBody,{headers}).subscribe(response=>{
      console.log(response)
    },
      (error)=>{
        console.log(error)
      }
    )
    // this.userAuth(loginBody).subscribe((userData) => {
    //   console.log(userData);
    //   this.loggedIn = true;
    // });
  }

  //hace login en la api
  userAuth(loginBody: ApiAuthBody): Observable<ApiAuthResponse> {
    let loginUrl: string = `${this.baseUrl}${enviroment.authRoute}`;
    return this.http.post<ApiAuthResponse>(loginUrl, loginBody).pipe(
      catchError((e) => {
        if (isDevMode()) {
          `Error al hacer login ${e}`;
        }
        return throwError(e);
      })
    );
  }

  //cerrar sesion
  public logOut(): void {
    this.loggedIn = false;
  }

  //devuelve si esta logeado
  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
