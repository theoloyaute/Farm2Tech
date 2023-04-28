import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Service} from "../models/service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  protected baseUrl = 'http://localhost:5276/api';
  protected componentUrl = this.baseUrl + '/Service';

  constructor(
    protected http: HttpClient
  ) { }

  getServiceById(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(this.componentUrl + '/' + id, {headers});
  }

  update(service: Service): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.put(this.componentUrl, service, {headers});
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
