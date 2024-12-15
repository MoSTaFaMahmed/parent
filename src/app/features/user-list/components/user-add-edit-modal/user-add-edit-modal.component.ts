import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserAddEdit } from '@core/models/user.modal';
import { UsersService } from '@core/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-add-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './user-add-edit-modal.component.html',
  styleUrl: './user-add-edit-modal.component.scss',
})
export class UserAddEditModalComponent {
  @Input() user!: User;
  @Input() mode: string = '';
  @Input() open = true;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();
  isSubmitting = false;
  userForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UsersService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      job_title: new FormControl('', [Validators.required]),
    });
  }

  ngOnChanges() {
    if (this.mode === 'edit' && this.user) {
      this.userForm.setValue({
        name: this.user.first_name,
        job_title: this.user.last_name,
      });
    } else if (this.mode === 'add') {
      this.userForm.reset();
    }
  }

  closeModal(): void {
    this.open = false;
    this.close.emit();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('please fill all data', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }
    this.isSubmitting = true;
    let msg = 'user added successfully';
    const userData: UserAddEdit = this.userForm.value;
    if (this.mode !== 'add') {
      userData.id = this.user.id;
    }
    this.userService
      .saveOrUpdateUser(userData, this.mode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: User) => {
          if (response) {
            this.isSubmitting = false;
            if (this.mode !== 'add') {
              userData.id = this.user.id;
              msg = 'user updated successfully'
            }
            this.snackBar.open(msg, 'Close', {
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
