import {Component, isDevMode, OnInit} from '@angular/core';
import {UsersListService} from "../users-list.service";
import {GetUserResponse, StateOptions, User} from "../users-list.types";
import {ConfirmationService, MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import * as _ from 'lodash'

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  usersList: User[] = [];
  selectedUser: User = new User();
  loading: boolean = false;
  activeDelete: boolean = false;
  activeEdit: boolean = false;
  activeNewUser: boolean = false;
  activeStateOptions: StateOptions[] = [{label: 'Activo', value: true}, {label: 'Inactivo', value: false}]
  adminStateOptions: StateOptions[] = [{label: 'Si', value: true}, {label: 'No', value: false}]

  constructor(
    private listUsersService: UsersListService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.listUsersService.getUsersList().subscribe((response: GetUserResponse) => {
      this.usersList = response.usuarios
      this.loading = false;
    })
  }

  public confirmSave() {

  }

  public confirmDelete(user: User) {
    this.activeDelete = true;
    this.selectedUser = user;
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este usuario?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-info-circle'
    })


  }

  public editHandler(user: User) {
    //TODO: Parsear usuarios en el backend
    this.selectedUser = {
      id: user.id,
      email: user.email,
      passwd: user.passwd,
      imageUri: user.imageUri,
      token: user.token,
      active: user.active == 1,
      admin: user.admin == 1,
      nick: user.nick
    } as User;
    console.log(this.selectedUser)
    this.activeEdit = true
  }

  public saveHandler() {
    console.log(this.selectedUser);
    //TODO: dialogo de confirmacion de guardado que llama a esta funcion
    //TODO: Logica para guardar
    this.activeEdit = false;
    this.messageService.add({severity: 'success', summary: 'Usuario guardado correctamente'});
    this.selectedUser = new User();
  }

  public deleteHandler(id: number | undefined) {
    this.loading = true;
    let userId = id || 0

    console.log(userId)
    //TODO: Logica para eliminar usuario llamando al service

    this.loading = false;
    this.activeDelete = false;
    this.messageService.add({severity: 'success', summary: 'Usuario eliminado correctamente'});
  }

  public cancelHandler() {
    this.messageService.add({severity: 'warn', summary: 'Cancelado'});
    //limpio la variable selectedUser
    this.selectedUser = new User();
    this.activeDelete = false;
    this.activeEdit = false;
    console.log(this.activeEdit)
  }

public newUserHandler(){
    console.log('Nuevo usuario...')
}
}
