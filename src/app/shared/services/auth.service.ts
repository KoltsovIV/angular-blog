import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { User } from "../components/interfaces";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {FBAuthRespose} from "../../../environments/interface";

@Injectable()

export class AuthService {

  constructor(private http: HttpClient) {
  }

  get token(): string {
    return ''
  }

  login(user: User ): Observable<any> {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      user)
      .pipe(
        tap( () => this.setToken)
      )
  }

  logout(){

  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(response: FBAuthRespose) {
  }
}
