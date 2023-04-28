import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Site} from "../models/site";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  protected baseUrl = 'http://localhost:5276/api';
  protected componentUrl = this.baseUrl + '/Site';

  constructor(
    protected http: HttpClient
  ) { }

  getSiteById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(this.componentUrl + '/' + id, {headers});
  }

  update(site: Site): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.put(this.componentUrl, site, {headers});
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
