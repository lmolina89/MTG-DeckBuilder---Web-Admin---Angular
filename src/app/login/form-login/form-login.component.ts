import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/auth/auth.service';
import {ApiLoginBody} from '../login.types';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
})
export class FormLoginComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  // email: string = 'lmolinamoreno@hotmail.com';
  // password: string = 'lmolina';
  email: string = 'admin@admin.com';
  password: string = 'admin';

  public onSubmit(event: any) {
    event.preventDefault();
    this.email = event.target.elements.email.value
    this.password = event.target.elements.password.value
    const loginBody: ApiLoginBody = {
      email: this.email,
      passwd: this.password
    }
    this.authService.doLogin(loginBody)

  }
}
