import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { User, FBAuthResponse } from "../components/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable()

export class AuthService {

  public error$: Subject<string> = new Subject<string>();
  static error$: any;

  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const expDate = new Date(localStorage.getItem('fb-token-exp')!);
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token')!;
  }

  login(user: User ): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post<FBAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user)
      .pipe(
        tap( resp => {
          AuthService.setToken(resp);
        }),
        catchError(AuthService.handleError.bind(this))
      )
  }

  logout(){
    AuthService.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private static handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;

    console.log(message)

    switch (message) {
      case 'INVALID_EMAIL':
        // @ts-ignore
        this.error$.next('Invalid Email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid Password');
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email Not Found');
        break
    }

    return throwError(error);
  }

  private static setToken(response: FBAuthResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }

  }
}
