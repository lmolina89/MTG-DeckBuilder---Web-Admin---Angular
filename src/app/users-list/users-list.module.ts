import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { UsersRoutingModule } from './users-list-routing.module';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RippleModule } from 'primeng/ripple';
import { EditFormComponent } from './edit-form/edit-form.component';
import { CreateFormComponent } from './create-form/create-form.component';

@NgModule({
  declarations: [ListUsersComponent, EditFormComponent, CreateFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastModule,
    DialogModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    ImageModule,
    SelectButtonModule,
    RippleModule,
  ],
  exports: [UsersRoutingModule],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class UsersListModule {}
