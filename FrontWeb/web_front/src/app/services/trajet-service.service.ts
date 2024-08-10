import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { port } from '../../../env';

@Injectable({
  providedIn: 'root'
})
export class TrajetServiceService {

  constructor(private http: HttpClient) { }

  AddTrajet(data: any) {
    return this.http.post(`${port}/trajets/add`, data);
  }
  FilterTrajet(data: any) {
    return this.http.get(`${port}/trajets/FilterTrajet`, { params: data });
  }
  DeleteTrajet(id: number) {
    return this.http.delete(`${port}/trajets/deleteTrajet/${id}`);
  }
  ReserverTrajet(data: any) {
    return this.http.post(`${port}/trajets/ReserverTrajet`, data);
  }
  AccepterUser(data: any) {
    return this.http.put(`${port}/trajets/AccepterUser`, data);
  }
  RejectUser(data: any) {
    return this.http.delete(`${port}/trajets/RejectUser`, { params: data });
  }
  getTrajets() {
    return this.http.get(`${port}/trajets/getTrajets`);
  }
  getTrajetAccepted() {
    return this.http.get(`${port}/trajets/getTrajetAccepted`);
  }
  getLatstNotif() {
    return this.http.get(`${port}/notif/getLatstNotif`);
  }
  DeleteAllNotif() {
    return this.http.delete(`${port}/notif/DeleteAllNotif`);
  }
  getRequest() {
    return this.http.get(`${port}/trajets/getRequest`);
  }
  SupprimerDeamnde(id: any) {
    return this.http.delete(`${port}/trajets/SupprimerDeamnde/${id}`);
  }
  CreateAlert(data: any) {
    return this.http.post(`${port}/Alert/CreateAlert`, data);
  }
}
