import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@core/models/user.modal';
import { UsersService } from '@core/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  @Input() user!: User;
  @Input() open = true;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UsersService,
    private snackBar: MatSnackBar
  ) {}

  closeModal(): void {
    this.open = false;
    this.close.emit();
  }

  delete() {
    this.isSubmitting = true;
    this.userService
      .deleteUser(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.isSubmitting = false;
            this.snackBar.open('user deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            this.save.emit(response);
            this.closeModal();
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.closeModal();
        },
      });
  }
}
