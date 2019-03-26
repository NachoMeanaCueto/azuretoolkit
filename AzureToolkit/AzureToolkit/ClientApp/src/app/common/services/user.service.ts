import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, AADUser } from '../models/User';

@Injectable()
export class UserService {
  private originUrl = window.location.origin;
  private aadUser: AADUser;

  constructor(private http: HttpClient) { }


  public getUser(): Observable<User> {

    return this.http.get(`${this.originUrl}/.auth/me`)
      .pipe(
        map(response => {
        try {
          this.aadUser = response[0] as AADUser;

            let user = new User();
            user.userId = this.aadUser.user_id;

            this.aadUser.user_claims.forEach(claim => {
              switch (claim.typ) {
                case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname":
                  user.firstName = claim.val;
                  break;
                case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname":
                  user.lastName = claim.val;
                  break;
              }
            });

            return user;
          }
          catch (Exception) {
            console.log(`Error: ${Exception}`);
          }
      }), catchError(this.handleError) 
    ) as Observable<User>
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
