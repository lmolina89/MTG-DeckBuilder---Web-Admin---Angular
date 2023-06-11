import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../users-list.service';
import {
  GetUserResponse,
  StateOptions,
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
  activeStateOptions: StateOptions[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  adminStateOptions: StateOptions[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];

  constructor(
    private listUsersService: UsersListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.updateUsersList()
  }

  //botones de dialogos de confirmacion//
  //boton aceptar
  acceptHandler() {
    console.log('Accept handler');
    this.loading = true;
    if (this.activeDelete) {
      console.log('delete');
      this.deleteUser(this.selectedUser.id);
      return;
    }
    if (this.activeEdit) {
      console.log('edit');
      this.saveHandler();
      return;
    }
    if (this.activeNewUser) {
      console.log('new user');

      this.saveHandler();
      //TODO: borrar toast despues de implementar la logica
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario creado correctamente',
      });
      return;
    }
  }

  //boton cancelar
  public cancelHandler() {
    this.messageService.add({ severity: 'warn', summary: 'Cancelado' });
    //limpio la variable selectedUser
    this.selectedUser = new User();
    this.activeDelete = false;
    this.activeEdit = false;
    this.activeNewUser = false;
  }

  //abrir ventanas de dialogo//
  //confirmacion al guardar cuando se edita un usuario
  public confirmEditSave() {
    this.confirmationService.confirm({
      message: 'Quieres guardar los cambios de este usuario?',
      header: 'Confirmar Edicion de usuario',
      icon: 'pi pi-info-circle',
      accept: () => this.acceptHandler(),
      reject: () => this.cancelHandler(),
    });
    //TODO: dialogo de confirmacion de guardado que llama a esta funcion
  }

  //confirmacion al guardar cuando se crea un nuevo usuario
  public confirmCreateSave() {
    this.confirmationService.confirm({
      message: 'Quieres guardar el nuevo usuario?',
      header: 'Confirmar nuevo usuario',
      icon: 'pi pi-info-circle',
      accept: () => this.acceptHandler(),
      reject: () => this.cancelHandler(),
    });
    //TODO: dialogo de confirmacion de guardado que llama a esta funcion
  }

  //confirmacion de eliminar usuario
  public confirmDelete(user: User) {
    this.selectedUser = user;
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle',
      accept: () => this.deleteUser(user.id),
      reject: () => this.cancelHandler(),
    });
  }

  //activar ventanas//
  //activa la ventana de editar
  public editHandler(user: User) {
    //TODO: Parsear usuarios en el backend
    this.selectedUser = {
      id: user.id,
      email: user.email,
      passwd: user.passwd,
      imageUri: user.imageUri,
      token: user.token,
      active: user.active == 1,
      admin: user.admin == 1,
      nick: user.nick,
    } as User;
    this.activeEdit = true;
  }

  //funciones de guardar y borrar//
  //guardar usuario editado o nuevo
  public saveHandler() {
    //Guardar usuario editado
    if (this.activeEdit) {
      console.log('editando usuario...');
      //guarda el usuario editado
      this.listUsersService
        .updateUser(this.selectedUser)
        .subscribe((response: any) => {
          if (response.result == 'ok') {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario editado correctamente',
            });
          }

          //recarga la lista de usuarios
          this.updateUsersList()
          //borra los datos del formulario
          this.selectedUser = new User();
        });
    }
    if (this.activeNewUser) {
      console.log('creando usuario...');
      this.listUsersService.createUser(this.newUser)
        .subscribe((response: any) => {
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
        })
    }
    this.activeEdit = false;
    this.activeNewUser = false;
  }

  //eliminar usuario
  public deleteUser(id: number | undefined) {
    this.loading = true;
    let userId = id || 0;
    this.listUsersService.deleteUser(userId)
      .subscribe((response: any) => {
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
      })
    this.activeDelete = false;
  }

  public newUserHandler() {
    console.log('Nuevo usuario...');
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
    _.delay(
      () => { this.router.navigate(['login']) },
      500,
      () => { this.loading = false }
    )
  }
}
