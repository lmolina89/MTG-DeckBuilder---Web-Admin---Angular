import { Component, OnInit } from '@angular/core';
import { UsersListService } from '../users-list.service';
import { GetUserResponse, RegisterResponse, Response, StateOptions, UpdateUserResponse, User } from '../users-list.types';
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
    //limpio la variables de los formularios
    this.selectedUser = new User();
    this.newUser = new User();
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
    this.listUsersService.deleteUser(userId).subscribe(
      (response: Response) => {
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

  checkFormValidity() {
    //expresiones regulares
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^[a-zA-Z0-9]{5,}$/;
    //valida el formato del email
    const emailControl = new FormControl(
      this.newUser.email,
      Validators.pattern(emailPattern)
    );
    //valida el formato de la contraseña
    const passwordControl = new FormControl(
      this.newUser.passwd,
      Validators.pattern(passwordPattern)
    );
    //true si el email no es undefined y tiene formato valido
    const emailValid = !!this.newUser.email && emailControl.valid;
    //si el email no es valido muestra el error
    if (!emailValid && this.newUser.email.length > 0) {
      this.errorEmail = 'Formato de email incorrecto';
    } else {
      this.errorEmail = '';
    }

    //true si la contraseña no es undefined y tiene formato valido
    const passwordValid = !!this.newUser.passwd && passwordControl.valid;
    //si la contraseña no es valida muestra el error
    if (!passwordValid && this.newUser.passwd.length > 0) {
      this.errorPass =
        'La contraseña no tiene formato correcto [a-z A-Z 0-9 5+]';
    } else {
      this.errorPass = '';
    }

    //comprueba que el nick no es undefined
    const nickValid = !!this.newUser.nick;

    //comprueba que el email no esta en uso
    let emailExists;
    if (emailValid) {
      emailExists = this.usersList.some(
        (user) => user.email === this.newUser.email
      );
      //si esta en uso muestra un error
      if (emailExists) {
        this.errorEmail = 'Este email ya esta en uso';
      } else {
        this.errorEmail = '';
      }
    }

    //comprueba que el nick no esta en uso
    let nickExists;
    if (nickValid) {
      nickExists = this.usersList.some(
        (user) => user.nick === this.newUser.nick
      );
      //si esta en uso muestra un error
      if (nickExists) {
        this.errorNick = 'Este nick ya esta en uso';
      } else {
        this.errorNick = '';
      }
    }
    //si todos los datos del formulario son correctos, activa el boton de guardar
    this.formCreate =
      emailValid && passwordValid && nickValid && !emailExists && !nickExists;
  }
}
