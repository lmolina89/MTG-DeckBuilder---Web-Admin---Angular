import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GetUserResponse, RegisterResponse, RegisterUserBody, Response, UpdateUserBody, UpdateUserResponse, User } from './users-list.types';

@Injectable({
  providedIn: 'root',
})
export class UsersListService {
  private baseUrl: string = '';

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

  public updateUser(user: User): Observable<UpdateUserResponse> {
    const updateUserUrl: string = `${this.baseUrl}${environment.usersRoute}?id=${user.id}`;
    const updateBody = {
      email: user.email,
      passwd: user.passwd,
      admin: user.admin,
      active: user.active,
    };
    let apiKey: string | null = sessionStorage.getItem('api-key');
    const headers = new HttpHeaders().set('api-key', apiKey || '');
    return this.http
      .put<UpdateUserResponse>(updateUserUrl, updateBody, { headers: headers })
      .pipe(
        catchError((e) => {
          if (isDevMode()) {
            console.error(`Error al editar usuario ${e.message}`);
          }
          return throwError(`Error al editar usuario ${e.message}`);
        })
      );
  }

  public createUser(user: User): Observable<RegisterResponse> {
    const createUrl: string = `${this.baseUrl}${environment.registerRoute}`;
    const registerBody: RegisterUserBody = {
      email: user.email,
      passwd: user.passwd,
      nick: user.nick ?? ''
    }
    console.log(registerBody)
    return this.http.post<RegisterResponse>(createUrl, registerBody).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al crear usuario `);
          console.log(e)
        }
        return throwError(`Error al crear usuario ${e.message}`);
      })
    )

  }

  public deleteUser(id: number):Observable<Response> {
    let deleteUserUrl: string = `${this.baseUrl}${environment.usersRoute}?id=${id}`;
    let apiKey: string | null = sessionStorage.getItem('api-key');
    const headers = new HttpHeaders().set('api-key', apiKey || '');
    return this.http.delete<Response>(deleteUserUrl, { headers: headers }).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al eliminar usuario ${e.message}`);
        }
        return throwError(`Error al eliminar usuario ${e.message}`);
      })
    );
  }
}
