import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpClient: HttpClient) {}

  api = 'http://localhost:8080';

  public saveEmployee(
    employee: Employee,
    file: File | null
  ): Observable<Employee> {
    const formData: FormData = new FormData();
    formData.append('employee', JSON.stringify(employee));
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.post<Employee>(`${this.api}/employees`, formData);
  }

  public getEmployees(page: number, pageSize: number): Observable<Employee[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<Employee[]>(`${this.api}/employees`, { params });
  }

  public deleteEmployee(employeeId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.api}/employees/${employeeId}`);
  }

  public getEmployee(employeeId: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.api}/employees/${employeeId}`);
  }

  public updateEmployee(
    employee: Employee,
    file: File | null
  ): Observable<Employee> {
    const formData: FormData = new FormData();
    formData.append('employee', JSON.stringify(employee));
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.put<Employee>(
      `${this.api}/employees/${employee.employeeId}`,
      formData
    );
  }

  public searchEmployees(
    keyword: string,
    page: number,
    pageSize: number
  ): Observable<Employee[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<Employee[]>(`${this.api}/employees/search`, {
      params,
    });
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
