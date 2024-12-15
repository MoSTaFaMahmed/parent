import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/auth.service';
import { LoginResponse } from '@core/models/auth.model';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [AsyncPipe,NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<LoginResponse | null>;
  userName: string = '';

  constructor(private authService: AuthenticationService) {
    this.isLoggedIn$ = this.authService.authTokenKey$;
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {

  }

  logOut(){
    this.authService.logout()
  }
}
