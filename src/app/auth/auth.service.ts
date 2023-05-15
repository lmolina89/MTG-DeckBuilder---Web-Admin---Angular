import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Implementa la lógica de autenticación aquí
  // Puedes tener métodos como `isLoggedIn()` para verificar si el usuario ha iniciado sesión


  public isLoggedIn():boolean{
    return true;
  }
}
