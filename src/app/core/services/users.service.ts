import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserAddEdit, UsersList } from '@core/models/user.modal';
import { environment } from '@env/environment.prod';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<UsersList> {
    return this.http.get<UsersList>(`${this.baseUrl}/users?page=${page}`);
  }

  saveOrUpdateUser(user: UserAddEdit, mode: string): Observable<User> {
    const url = `${this.baseUrl}/users`;
    if (mode === 'add') {
      return this.http.post<User>(url, user);
    } else if (mode === 'edit') {
      return this.http.put<User>(`${url}/${user.id}`, user);
    }
    throw new Error('Invalid mode. Use "add" or "edit"');
  }

  deleteUser(id: number): Observable<number> {
    const url = `${this.baseUrl}/users/${id}`;
    return this.http.delete<any>(url).pipe(
      map(() => 204)
    );
  }
}
