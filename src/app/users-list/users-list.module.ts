import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UsersRoutingModule } from './users-list-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ListUsersComponent,
    EditUserComponent,
    NewUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    UsersRoutingModule
  ]
})
export class UsersListModule { }
