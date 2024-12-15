import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        console.log(errorMessage);
        switch (error.status) {
          case 0:
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 400:
            errorMessage = 'Bad Request. Please check your input.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 401:
            errorMessage = 'Unauthorized access. Redirecting to login.';
            this.router.navigate(['/']);
            break;
          default:
            errorMessage = `Error: ${error.message}`;
            break;
        }
        console.log(errorMessage);

        this.snackBar.open( errorMessage,'Close', {
          duration: 3000,
        });



        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
