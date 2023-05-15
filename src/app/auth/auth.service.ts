import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { enviroment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variable boolean para identificar si esta logeado
  private loggedIn = false;
  //url base de la api
  baseUrl: string = enviroment.baseUrl;

  constructor(private http: HttpClient) {}

  //hace login en la api
  doLogin(email: string, password: string): Promise<boolean> {
    let loginUrl: string = `${this.baseUrl}/${enviroment.authRoute}`;
    const loginData = {
      email: email,
      password: password,
    };
    console.log(loginData)
    return firstValueFrom(this.http.post<boolean>(loginUrl, loginData));
  }

  public logOut(): void {}

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
