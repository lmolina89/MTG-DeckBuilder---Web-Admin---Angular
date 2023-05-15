import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
})
export class FormLoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  email: string = '';
  password: string = '';

  public onSubmit() {
    console.log(this.email + ' ' + this.password);
    this.authService.doLogin(this.email, this.password);
  }
}
