import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLoginComponent } from './form-login/form-login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FormLoginComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    PasswordModule,
    RouterModule
  ],
})
export class LoginModule {}
