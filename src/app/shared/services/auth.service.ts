import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { User, FBAuthResponse } from "../components/interfaces";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable()

export class AuthService {

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
        })
      )
  }

  logout(){
    AuthService.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token
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
