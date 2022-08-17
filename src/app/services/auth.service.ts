import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { userResponse } from '../interfaces/userResponse';
import { ForgotPassword } from '../interfaces/forgotPassword';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private token: string;

  forgotPassword(loginId: string, forgotPassword: ForgotPassword) {
    return this.http.post<string>(environment.ApiUrl + `/${loginId}/forgot`, forgotPassword, { responseType: 'text' as 'json' });
  }
  resetPassword(loginId: string, forgotPassword: ForgotPassword) {
    return this.http.post<string>(environment.ApiUrl + `/${loginId}/forgot`, forgotPassword, { responseType: 'text' as 'json' });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  setCurrentUser(user: User) {
    if (user == null) {
      localStorage.removeItem('currentUser');
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUser') != null) {
      return true;
    }
    return false;
  }

  login(loginId: string, password: string) {
    return this.http.post<any>(environment.ApiUrl + '/login', { loginId, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log(user);
        console.log("---" + user.token);
        this.token = user.token;
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  getToken() {
    return this.token;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: User) {
    console.log('Auth service register');
    return this.http.post(environment.ApiUrl + '/register', user);
  }
}
