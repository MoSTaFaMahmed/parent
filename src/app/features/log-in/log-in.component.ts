import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core/services/auth.service';
import { LoginResponse, LoginRequest } from '@core/models/auth.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [AuthenticationService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();
  isSubmitting = false;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private snackBar :MatSnackBar
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.isSubmitting = true;
    if (this.loginForm.invalid) {
      this.snackBar.open( "please fill all data",'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      this.isSubmitting = false;
      return;
    }

    const userData: LoginRequest = this.loginForm.value;
    this.authService.login(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: LoginResponse) => {
          if (response) {
            this.router.navigate(['/user-list']);
            this.isSubmitting = false;
          }
        },
        error: () => {
          this.errorMessage = 'Invalid username or password.';
          this.isSubmitting = false;
        }
      });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
