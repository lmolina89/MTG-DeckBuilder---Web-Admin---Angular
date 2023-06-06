import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormLoginComponent } from './login/form-login/form-login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: FormLoginComponent }, // Ruta de inicio de sesión
  {
    path: 'users', // Ruta de lista de usuarios
    canActivate: [AuthGuard], // Comprueba que el usuario ha iniciado sesión para continuar
    loadChildren: () =>
      import('./users-list/users-list.module').then((m) => m.UsersListModule), // Cargar el módulo users-list
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redireccionar al componente de inicio de sesión por defecto
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redireccionar al componente de inicio de sesión en caso de ruta no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
