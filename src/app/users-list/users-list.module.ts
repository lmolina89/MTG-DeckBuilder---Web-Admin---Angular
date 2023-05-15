import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewUserComponent } from './new-user/new-user.component';



@NgModule({
  declarations: [
    ListUsersComponent,
    EditUserComponent,
    NewUserComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UsersListModule { }
