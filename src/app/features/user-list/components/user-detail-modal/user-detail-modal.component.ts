import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@core/models/user.modal'; // Assuming User model exists

@Component({
  selector: 'app-user-detail-modal',
  standalone: true,
  imports: [NgIf, MatIconModule],
  templateUrl: './user-detail-modal.component.html',
  styleUrl: './user-detail-modal.component.scss',
})
export class UserDetailModalComponent {
  @Input() user!: User;
  @Input() mode!: string;
  @Input() open = true;
  @Output() close = new EventEmitter();
  @Output() openModal = new EventEmitter();

  closeModal(): void {
    this.open = false;
    this.close.emit();
  }
  onOpenDeleteModal() {
    this.openModal.emit({user:this.user,type:'delete'});
  }
  onOpenEditModal(){
    this.openModal.emit({user:this.user,type:'edit'});
  }
}
