import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Employee } from './Models/employee.model'; 
import { EmployeeService } from './services/employee.service'; 

@Injectable({
  providedIn: 'root'
})
export class EmployeeResolver implements Resolve<Employee> {
  constructor(private employeeService: EmployeeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    const employeeId = route.paramMap.get('employeeId');

    if (employeeId) {
      // make api call and get data for given employee id
      return this.employeeService.getEmployee(Number(employeeId));
    } else {
      // create and return empty employee details
      const employee: Employee = {
        employeeId: 0,
        employeeName: '',
        employeeContactNumber: '',
        employeeAddress: '',
        employeeGender: { id: 0, name: '' },
        employeeDepartment: { id: 0, name: '' },
        employeeSkills: [],
        employeeFile: ''
      };

      return of(employee);
    }
  }
}
