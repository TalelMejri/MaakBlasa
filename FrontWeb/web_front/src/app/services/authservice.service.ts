import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { port } from '../../../env';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  Register(data: any) {
    return  this.http.post(`${port}/auth/register`, data);
  }
  getProfile() {
    return this.http.get(`${port}/auth/user`);
  }
  UdpateWelcome(){
    return this.http.put(`${port}/auth/UpdateUser`, {});
  }
}
