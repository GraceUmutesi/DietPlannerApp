import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // apiRoot = 'http://localhost:8000/api/';
  apiRoot = "https://diet-planner-api.herokuapp.com/api/";

  token = null;
  userData: any;
	storage: any = window.sessionStorage;

  httpOptions = {};

  constructor(private http: HttpClient) { 
    this.token = this.storage.getItem('token');
    this.userData = JSON.parse(this.storage.getItem('user_data'));

    if (this.token != null && this.token !== '') {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: this.token
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        })
      };
    }
  }

  getRequest(endpoint: string) {
    const url = `${this.apiRoot}${endpoint}`;
    return this.http.get(url, this.httpOptions);
  }
  getMore(endpoint: string) {
    return this.http.get(endpoint, this.httpOptions);
  }

  postRequest(endpoint: string, data: any) {
    const url = `${this.apiRoot}${endpoint}`;
    return this.http.post(url, data, this.httpOptions);
  }

  patchRequest(endpoint: string, data: any) {
    const url = `${this.apiRoot}${endpoint}`;
    return this.http.patch(url, data, this.httpOptions);
  }

  deleteRequest(endpoint: string) {
    const url = `${this.apiRoot}${endpoint}`;
    return this.http.delete(url, this.httpOptions);
  }

  updateHttpOptions() {
    this.token = this.storage.getItem('token');
    this.userData = JSON.parse(this.storage.getItem('user_data'));

    if (this.token != null && this.token !== '') {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: this.token
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        })
      };
    }
  }

  addingRecipeImage(endpoint, params) {
    const url = `${this.apiRoot}${endpoint}`;
    const httpOpts = {
      headers: new HttpHeaders({
        Authorization: this.storage.getItem('token')
      })
    };
    return this.http.post(url, params, httpOpts);
  }
  
}
