import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // El usuario ha iniciado sesión, permitir acceso a la ruta
    } else {
      this.router.navigate(['/login']); // El usuario no ha iniciado sesión, redirigir al componente de inicio de sesión
      return false;
    }
  }
}
