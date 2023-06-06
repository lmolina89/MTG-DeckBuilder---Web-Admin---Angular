import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { catchError, Observable, tap, throwError } from "rxjs";
import { GetUserResponse, User } from "./users-list.types";

@Injectable({
  providedIn: 'root'
})
export class UsersListService {
  baseUrl = '';

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.baseUrl = environment.baseUrlLocalhost;
    } else {
      this.baseUrl = environment.baseUrl;
    }
  }

  public getUsersList(): Observable<GetUserResponse> {
    const finalUrl = `${this.baseUrl}${environment.usersRoute}`;
    let apiKey: string | null = sessionStorage.getItem('api-key');
    console.log(apiKey)
    const headers = new HttpHeaders().set('api-key', apiKey || '');
    return this.http.get<GetUserResponse>(finalUrl, { headers: headers }).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al traer la lista de usuarios ${e.message}`);
        }
        return throwError(`Error al traer la lista de usuarios ${e.message}`);
      })
    );
  }

  public updateUser() {

  }

  public deleteUser(){

  }
}