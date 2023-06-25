import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../users-list.service';
import {
  GetUserResponse,
  RegisterResponse,
  Response,
  UpdateUserResponse,
  User,
} from '../users-list.types';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  usersList: User[] = [];
  selectedUser: User = new User();
  newUser: User = new User();
  loading: boolean = false;
  activeDelete: boolean = false;
  activeEdit: boolean = false;
  activeNewUser: boolean = false;

  constructor(
    private listUsersService: UsersListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.updateUsersList();
  }

  //botones de dialogos de confirmacion//
  //boton aceptar
  acceptHandler() {
    this.loading = true;
    if (this.activeDelete) {
      this.deleteUser(this.selectedUser.id);
      return;
    }
    if (this.activeEdit) {
      this.saveHandler();
      return;
    }
    if (this.activeNewUser) {
      this.saveHandler();
      return;
    }
  }

  //boton cancelar
  public cancelHandler() {
    this.messageService.add({ severity: 'warn', summary: 'Cancelado' });
    //limpio la variables de los formularios

    // this.selectedUser = new User();

    this.newUser = new User();

    this.activeDelete = false;
    this.activeEdit = false;
    this.activeNewUser = false;
  }

  //abrir ventanas de dialogo//
  //confirmacion al guardar cuando se edita un usuario
  public confirmEditSave(event: any) {
    //modifico el usuario seleccionado con los datos del formulario
    this.selectedUser = {
      id: event.id,
      email: event.email,
      nick: event.nick,
      admin: event.admin,
      active: event.active,
    };
    //dialogo de confirmacion
    this.confirmationService.confirm({
      message: 'Quieres guardar los cambios de este usuario?',
      header: 'Confirmar Edicion de usuario',
      icon: 'pi pi-info-circle',
      accept: () => this.acceptHandler(),
    });
  }

  //confirmacion al guardar cuando se crea un nuevo usuario
  public confirmCreateSave(event: any) {
    this.newUser = {
      email: event.email,
      passwd: event.passwd,
      nick: event.nick,
      active: event.active,
      admin: event.admin,
    };
    //dialogo de confirmacion
    this.confirmationService.confirm({
      message: 'Quieres guardar el nuevo usuario?',
      header: 'Confirmar nuevo usuario',
      icon: 'pi pi-info-circle',
      accept: () => this.acceptHandler(),
    });
  }

  //confirmacion de eliminar usuario
  public confirmDelete(user: User) {
    this.selectedUser = user;
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      accept: () => this.deleteUser(user.id),
    });
  }

  //activar ventanas//
  //activa la ventana de editar
  public editHandler(user: User) {
    this.selectedUser = {
      id: user.id,
      email: user.email,
      nick: user.nick,
      active: user.active == 1,
      admin: user.admin == 1,
    } as User;
    this.activeEdit = true;
  }

  //funciones de guardar y borrar//
  //guardar usuario editado o nuevo
  public saveHandler() {
    //Guardar usuario editado
    if (this.activeEdit) {
      //guarda el usuario editado
      this.listUsersService
        .updateUser(this.selectedUser)
        .subscribe((response: UpdateUserResponse) => {
          if (response.result == 'ok') {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario editado correctamente',
            });
          }
          //recarga la lista de usuarios
          this.updateUsersList();
          //borra los datos del formulario
          this.selectedUser = new User();
        });
    }
    if (this.activeNewUser) {
      this.listUsersService
        .createUser(this.newUser)
        .subscribe((response: RegisterResponse) => {
          if (response.result == 'ok') {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario creado correctamente',
            });
          }
          //recarga la lista de usuarios
          this.updateUsersList();
          //borra los datos del formulario
          this.newUser = new User();
        });
    }
    this.activeEdit = false;
    this.activeNewUser = false;
  }

  //eliminar usuario
  public deleteUser(id: number | undefined) {
    this.loading = true;
    let userId = id || 0;
    this.listUsersService.deleteUser(userId).subscribe((response: Response) => {
      if (response.result == 'ok') {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario eliminado correctamente',
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'No se ha eliminado el usuario',
        });
      }
      this.updateUsersList();
    });
    this.activeDelete = false;
  }

  public newUserHandler() {
    this.activeNewUser = true;
  }

  private updateUsersList(): void {
    this.listUsersService
      .getUsersList()
      .subscribe((response: GetUserResponse) => {
        this.usersList = response.usuarios;
        this.loading = false;
      });
  }

  //cerrar sesion
  logOut() {
    this.loading = true;
    this.authService.logOut();
    //delay para que no cambie de ventana demasiado rapido
    this.messageService.add({
      severity: 'warn',
      summary: 'Cerrando sesion...',
    });
    _.delay(
      () => {
        this.router.navigate(['login']);
      },
      800,
      () => {
        this.loading = false;
      }
    );
  }
}
