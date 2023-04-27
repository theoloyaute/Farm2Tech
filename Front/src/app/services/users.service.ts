import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected baseUrl = 'http://localhost:5276/api';
  protected componentUrl = this.baseUrl + '/Users';

  constructor(
    protected router: Router,
    protected http: HttpClient
  ) { }

  getUsers(): Observable<any>{
    const params: HttpParams = new HttpParams();
    return this.http.get(this.componentUrl, {params})
  }

  getUserBySearch(searchValue: string): Observable<any>{
    const params: HttpParams = new HttpParams();
    return this.http.get(this.componentUrl + '/' + searchValue , {params});
  }
}
