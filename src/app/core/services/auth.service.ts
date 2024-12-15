import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse, LoginRequest } from '@core/models/auth.model';
import { environment } from '@env/environment.prod';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = environment.baseUrl;

  private _isLoggedInSubject = new BehaviorSubject<boolean>(
    this.authTokenKey()
  );
  public authTokenKey$ = this._isLoggedInSubject.asObservable();

  private _userSubject = new BehaviorSubject<LoginResponse | null>(
    this.getUser()
  );
  public user$ = this._userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(userData: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, userData)
      .pipe(
        map((result) => {
          if (result) {
            this._userSubject.next(result);
            const token = { token: result.token };
            localStorage.setItem('authTokenKey', JSON.stringify(token));
            const user = userData;
            localStorage.setItem('user', JSON.stringify(user));
          }
          return result;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authTokenKey');
    localStorage.removeItem('user');
    this._userSubject.next(null);
    this._isLoggedInSubject.next(false);
  }

  authTokenKey(): boolean {
    return !!localStorage.getItem('authTokenKey');
  }

  getUser(): LoginResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
