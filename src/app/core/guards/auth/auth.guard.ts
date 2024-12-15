import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn =  this.authService.authTokenKey()


        if (isLoggedIn) {
          if (state.url === '/') {
            this.router.navigate(['/user-list']);
            return false;
          }
        }


        if (!isLoggedIn && state.url !== '/') {
          this.router.navigate(['/']);
          return false;
        }

        return true;

  }
}
