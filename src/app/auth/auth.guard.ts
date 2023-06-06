import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true; // El usuario ha iniciado sesión, permitir acceso a la ruta
    } else {
      this.router.navigate(['/login']);
      return false; // El usuario no ha iniciado sesión, redirigir al componente de inicio de sesión
    }
  }
}
