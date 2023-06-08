import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GetUserResponse, UpdateUserBody, User } from './users-list.types';

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

  public updateUser(user: User): Observable<Response> {
    let updateUserUrl: string = `${this.baseUrl}${environment.usersRoute}/${user.id}`;
    const updateBody = {
      admin: user.admin,
      active: user.active
    }    
    return this.http.put<Response>(updateUserUrl, updateBody).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al editar usuario ${e.message}`);
        }
        return throwError(`Error al editar usuario ${e.message}`);
      })
    );
  }

  public deleteUser(id: number) {
    let deleteUserUrl: string = `${this.baseUrl}${environment.usersRoute}/${id}`;
    return this.http.delete<Response>(deleteUserUrl).pipe(
      catchError((e) => {
        if (isDevMode()) {
          console.error(`Error al eliminar usuario ${e.message}`);
        }
        return throwError(`Error al eliminar usuario ${e.message}`);
      })
    );
  }
}
