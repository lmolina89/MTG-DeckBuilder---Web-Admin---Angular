import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../users-list.types';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
})
export class CreateFormComponent {
  user: User = new User();
  usersList: User[] = new Array<User>();
  activeNewUser: boolean = false;
  formCreate: boolean = false;

  errorEmail: string = '';
  errorPass: string = '';
  errorNick: string = '';

  @Input() set newUser(user: User) {
    this.user = user;
    if (user) {
      this.activeNewUser = true;
    }
  }

  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<User>();

  onCancel() {
    this.cancelEvent.emit();
    this.activeNewUser = false;
    this.errorEmail = '';
    this.errorNick = '';
    this.errorPass = '';
  }

  onSave() {
    this.saveEvent.emit(this.user);
    this.activeNewUser = false;
  }

  checkFormValidity() {
    //expresiones regulares
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^[a-zA-Z0-9]{5,}$/;
    //valida el formato del email
    const emailControl = new FormControl(
      this.user.email,
      Validators.pattern(emailPattern)
    );
    //valida el formato de la contraseña
    const passwordControl = new FormControl(
      this.user.passwd,
      Validators.pattern(passwordPattern)
    );
    //true si el email no es undefined y tiene formato valido
    const emailValid = !!this.user.email && emailControl.valid;
    //si el email no es valido muestra el error
    if (!emailValid && this.user.email && this.user.email.length > 0) {
      this.errorEmail = 'Formato de email incorrecto';
    } else {
      this.errorEmail = '';
    }

    //true si la contraseña no es undefined y tiene formato valido
    const passwordValid = !!this.user.passwd && passwordControl.valid;
    //si la contraseña no es valida muestra el error
    if (!passwordValid && this.user.passwd && this.user.passwd.length > 0) {
      this.errorPass =
        'La contraseña no tiene formato correcto [a-z A-Z 0-9 5+]';
    } else {
      this.errorPass = '';
    }

    //comprueba que el nick no es undefined
    const nickValid = !!this.user.nick;

    //comprueba que el email no esta en uso
    let emailExists;
    if (emailValid) {
      emailExists = this.usersList.some(
        (user) => user.email === this.user.email
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
      nickExists = this.usersList.some((user) => user.nick === this.user.nick);
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
