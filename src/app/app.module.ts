import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { AuthService } from './auth/auth.service';
import { UsersListModule } from './users-list/users-list.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    // UsersListModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
