import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupRequestPayload} from '../signup/signup-request.payload';
import {Observable} from 'rxjs';
import {LoginRequestPayload} from '../login/login-request.payload';
import {LoginResponse} from '../login/login-response.payload';
import {map, tap} from 'rxjs/operators';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService
  ) {
  }

  signup(payload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('api/auth/signup', payload, {
      responseType: 'text'
    });
  }

  login(payload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient
      .post<LoginResponse>('api/auth/login', payload)
      .pipe(map((data: LoginResponse) => {
        this.localStorage.store('auth', {
          authenticationToken: data.authenticationToken,
          username: data.username,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt
        });

        return true;
      }));
  }

  get(field: 'authenticationToken' | 'username' | 'refreshToken' | 'expiresAt'): string {
    return this.localStorage.retrieve('auth')[field];
  }

  refreshToken(): Observable<any> {
    const payload = {
      refreshToken: this.get('refreshToken'), username: this.get('username')
    };
    return this.httpClient.post<LoginResponse>('api/auth/token/refresh', payload)
      .pipe(tap((data) => {
        this.localStorage.store('auth', {
          authenticationToken: data.authenticationToken,
          username: data.username,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt
        });
      }));
  }
}
