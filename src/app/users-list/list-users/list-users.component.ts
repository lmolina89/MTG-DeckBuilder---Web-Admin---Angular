import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../users-list.service';
import { GetUserResponse, StateOptions, User } from '../users-list.types';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

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
  formEdit: boolean = false;
  formCreate: boolean = false;
  errorEmail: string = '';
  errorPass: string = '';
  errorNick: string = '';

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
    //limpio la variable selectedUser
    this.selectedUser = new User();
    this.activeDelete = false;
    this.activeEdit = false;
    this.activeNewUser = false;
    this.errorEmail = '';
    this.errorNick = '';
    this.errorPass = '';
  }

  //abrir ventanas de dialogo//
  //confirmacion al guardar cuando se edita un usuario
  public confirmEditSave() {
    this.confirmationService.confirm({
      message: 'Quieres guardar los cambios de este usuario?',
      header: 'Confirmar Edicion de usuario',
      icon: 'pi pi-info-circle',
      accept: () => this.acceptHandler(),
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
    });
  }

  //activar ventanas//
  //activa la ventana de editar
  public editHandler(user: User) {
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
          this.updateUsersList();
          //borra los datos del formulario
          this.selectedUser = new User();
        });
    }
    if (this.activeNewUser) {
      console.log('creando usuario...');
      this.listUsersService
        .createUser(this.newUser)
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
        });
    }
    this.activeEdit = false;
    this.activeNewUser = false;
  }

  //eliminar usuario
  public deleteUser(id: number | undefined) {
    this.loading = true;
    let userId = id || 0;
    this.listUsersService.deleteUser(userId).subscribe((response: any) => {
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
      () => {
        this.router.navigate(['login']);
      },
      500,
      () => {
        this.loading = false;
      }
    );
  }

  checkFormValidity() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^[a-zA-Z0-9]{5,}$/;

    const emailControl = new FormControl(
      this.newUser.email,
      Validators.pattern(emailPattern)
    );
    const passwordControl = new FormControl(
      this.newUser.passwd,
      Validators.pattern(passwordPattern)
    );

    const emailValid = !!this.newUser.email && emailControl.valid;
    if (!emailValid) {
      this.errorEmail = 'Formato de email incorrecto';
    } else {
      this.errorEmail = '';
    }
    const passwordValid = !!this.newUser.passwd && passwordControl.valid;
    if (!passwordValid && this.newUser.passwd.length > 0) {
      this.errorPass = 'La contraseña no tiene formato correcto [a-zA-Z0-9 5+]';
    } else {
      this.errorPass = '';
    }
    const nickValid = !!this.newUser.nick;

    let emailExists;
    if (emailValid) {
      emailExists = this.usersList.some(
        (user) => user.email === this.newUser.email
      );

      if (emailExists) {
        this.errorEmail = 'Este email ya esta en uso';
      } else {
        this.errorEmail = '';
      }
    }
    let nickExists;
    if (nickValid) {
      nickExists = this.usersList.some(
        (user) => user.nick === this.newUser.nick
      );

      if (nickExists) {
        this.errorNick = 'Este nick ya esta en uso';
      } else {
        this.errorNick = '';
      }
    }

    this.formCreate =
      emailValid && passwordValid && nickValid && !emailExists && !nickExists;
  }
}
