import {  Routes } from '@angular/router';
import { AuthenticationGuard } from '@core/guards/auth/auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LogInComponent } from './features/log-in/log-in.component';
import { UserListComponent } from './features/user-list/page/user-list.component';

export const routes: Routes = [
  { path: '', component: LogInComponent, canActivate: [AuthenticationGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthenticationGuard] },

  {
    path: '**',component : NotFoundComponent
  }
];




