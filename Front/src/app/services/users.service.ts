import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected baseUrl = 'http://localhost:5276/api';
  protected componentUrl = this.baseUrl + '/Users';

  constructor(
    protected http: HttpClient
  ) {
  }

  getUsers(): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.get(this.componentUrl, {params})
  }

  getUserById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(this.componentUrl + '/' + id, {headers});
  }

  getUserBySearch(searchValue: string): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http.get(this.componentUrl + '/' + searchValue, {params});
  }

  create(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.componentUrl, user, {headers});
  }

  update(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.put(this.componentUrl, user, {headers});
  }

  delete(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.delete(this.componentUrl + '/' + id, {headers});
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }
}
