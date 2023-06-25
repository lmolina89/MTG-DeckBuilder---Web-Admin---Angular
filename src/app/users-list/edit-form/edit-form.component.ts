import {
  Component,
  EventEmitter,
  Input,
  Output,
  isDevMode,
} from '@angular/core';
import { StateOptions, User } from '../users-list.types';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
})
export class EditFormComponent {
  formEdit: boolean = false;
  activeEdit: boolean = false;
  user: User = new User();

  constructor() {}

  //eventos para guardar y cancelar
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<User>();

  @Input() set selectedUser(user: User) {
    this.user = user;
    if (user) {
      this.activeEdit = true;
    }
  }
  activeStateOptions: StateOptions[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  adminStateOptions: StateOptions[] = [
    { label: 'Si', value: true },
    { label: 'No', value: false },
  ];

  public onCancel() {
    //emite el evento de cancelar
    this.cancelEvent.emit();
    this.activeEdit = false;
  }

  public onSave() {
    this.saveEvent.emit(this.user);
    this.activeEdit = false;
  }
}
