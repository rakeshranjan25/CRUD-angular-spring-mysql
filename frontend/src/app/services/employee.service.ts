import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../Models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private api = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  public saveEmployee(employee: Employee, file: File | null): Observable<Employee> {
    const formData: FormData = new FormData();
    formData.append('employee', JSON.stringify(employee));
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.post<Employee>(`${this.api}/employees`, formData);
  }

  public getEmployees(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<any>(`${this.api}/employees`, { params });
  }

  public deleteEmployee(employeeId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/employees/${employeeId}`);
  }

  public getEmployee(employeeId: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.api}/employees/${employeeId}`);
  }

  public updateEmployee(employee: Employee, file: File | null): Observable<Employee> {
    const formData: FormData = new FormData();
    formData.append('employee', JSON.stringify(employee));
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.put<Employee>(`${this.api}/employees/${employee.employeeId}`, formData);
  }

  public searchEmployees(keyword: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<any>(`${this.api}/employees/search`, { params });
  }

  // Method for fetching paginated filtered data
  public getPaginatedFilteredEmployees(department: string, gender: string, skill: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (department) {
      params = params.set('department', department);
    }
    if (gender) {
      params = params.set('gender', gender);
    }
    if (skill) {
      params = params.set('skill', skill);
    }

    return this.httpClient.get<any>(`${this.api}/filter`, { params });
  }

  // Method for fetching all filtered data
  public getFilteredEmployees(department: string, gender: string, skill: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (department) {
      params = params.set('department', department);
    }
    if (gender) {
      params = params.set('gender', gender);
    }
    if (skill) {
      params = params.set('skill', skill);
    }

    return this.httpClient.get<Employee[]>(`${this.api}/filter/all`, { params });
  }

  public downloadEmployeeFile(employeeId: number, fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/octet-stream'
    });

    return this.httpClient.get(`${this.api}/employees/${employeeId}/file`, {
      responseType: 'blob',
      headers: headers
    });
  }
}
