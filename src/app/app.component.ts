import { Component } from '@angular/core';
import { NavBarComponent } from './layouts/nav-bar/nav-bar.component';
import { LogInComponent } from './features/log-in/log-in.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive,  RouterOutlet } from '@angular/router';
import { UserListComponent } from './features/user-list/page/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent,LogInComponent,HttpClientModule,RouterOutlet, RouterLink, RouterLinkActive , UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'parent';
    constructor() {}


}
