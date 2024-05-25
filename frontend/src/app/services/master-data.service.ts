import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/departments`);
  }

  getAllGenders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genders`);
  }

  getAllSkills(): Observable<any> {
    return this.http.get(`${this.baseUrl}/skills`);
  }
}
