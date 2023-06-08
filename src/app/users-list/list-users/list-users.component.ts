import { Component, isDevMode, OnInit } from '@angular/core';
import { UsersListService } from '../users-list.service';
import {
  GetUserResponse,
  StateOptions,
  UpdateUserBody,
  User,
} from '../users-list.types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  usersList: User[] = [];
  selectedUser: User = new User();
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.listUsersService
      .getUsersList()
      .subscribe((response: GetUserResponse) => {
        this.usersList = response.usuarios;
        this.loading = false;
      });
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
      //TODO: borrar toast despues de implementar la logica
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario editado correctamente',
      });
      return;
    }
    if (this.activeNewUser) {
      console.log('new user');
      console.log(this.selectedUser);
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
    const updateBody: User = this.selectedUser;
    if (this.activeEdit) {
      console.log('editando usuario...');
      this.listUsersService
        .updateUser(updateBody)
        .subscribe((response: any) => {
          console.log(response);
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Usuario editado correctamente',
          // });
          this.loading = false;
        });
      //TODO: Logica para guardar
    }
    if (this.activeNewUser) {
      console.log('creando usuario...');
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'Usuario creado correctamente',
      // });
    }
    this.activeEdit = false;
    this.activeNewUser = false;

    this.selectedUser = new User();
  }

  //eliminar usuario
  public deleteUser(id: number | undefined) {
    this.loading = true;
    let userId = id || 0;

    console.log(userId);
    //TODO: Logica para eliminar usuario llamando al service

    this.loading = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Usuario eliminado correctamente',
    });
    this.activeDelete = false;
  }

  public newUserHandler() {
    console.log('Nuevo usuario...');
  }
}
