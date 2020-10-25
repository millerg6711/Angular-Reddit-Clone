import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {AuthService} from './auth/shared/auth.service';
import {catchError, switchMap} from 'rxjs/operators';
import {LoginResponse} from './auth/login/login-response.payload';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

  isTokenRefreshing = false;
  refreshTokenSubject = new BehaviorSubject(null);

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string,
    private authService: AuthService
  ) {
  }

  private static addToken(req: HttpRequest<unknown>, jwtToken: any): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({url: `${this.baseUrl}/${request.url}`});

    const jwtToken = this.authService.get('authenticationToken');
    if (jwtToken) {
      HttpClientInterceptor.addToken(req, jwtToken);
    }
    return next
      .handle(req)
      .pipe(catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 403) {
            return this.handleAuthErrors(req, next);
          }
          return throwError(err);
        })
      );
  }

  private handleAuthErrors(req: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService
        .refreshToken()
        .pipe(
          switchMap((refreshTokenResponse: LoginResponse) => {
            this.isTokenRefreshing = false;
            this.refreshTokenSubject.next(refreshTokenResponse.authenticationToken);
            return next.handle(HttpClientInterceptor.addToken(req, refreshTokenResponse.authenticationToken));
          })
        );
    }
    return of(null);
  }
}
