import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@core/models/user.modal';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() openModal = new EventEmitter();
  @Output() open = new EventEmitter();
  selectedUser!: User ;

  openUserModal(user: User , type : string): void {
    this.openModal.emit({user,type});
    this.open.emit({mode:true,type});
  }


}
