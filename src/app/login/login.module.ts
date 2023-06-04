import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormLoginComponent} from './form-login/form-login.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {RouterModule} from '@angular/router';

import {CardModule} from 'primeng/card'

import {DividerModule} from 'primeng/divider';
import {StyleClassModule} from 'primeng/styleclass';
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [FormLoginComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    PasswordModule,
    RouterModule,
    CardModule,
    DividerModule,
    StyleClassModule,
    CardModule,
    RippleModule

  ],
})
export class LoginModule {
}
