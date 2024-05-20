import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  isCreateEmployee: boolean = true;
  employee: any;
  skills: string[] = [];
  selectedFile: File | null = null; // Add this line

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employee = this.activatedRoute.snapshot.data['employee'];
    console.log(this.employee);

    if (this.employee && this.employee.employeeId > 0) {
      this.isCreateEmployee = false;
      if (this.employee.employeeSkills != '') {
        this.skills = this.employee.employeeSkills.split(',');
      }
    } else {
      this.isCreateEmployee = true;
    }
  }

  checkSkills(skill: string): boolean {
    return this.employee.employeeSkills != null && this.employee.employeeSkills.includes(skill);
  }

  checkGender(gender: string): boolean {
    return this.employee.employeeGender != null && this.employee.employeeGender === gender;
  }

  onSubmit(employeeForm: NgForm): void {
    if (employeeForm.invalid) {
      employeeForm.controls['employeeName'].markAsTouched();
      return;
    }
    this.saveEmployee(employeeForm);
  }

  saveEmployee(employeeForm: NgForm): void {
    if (this.isCreateEmployee) {
      this.employeeService.saveEmployee(this.employee, this.selectedFile).subscribe( // Update this line
        {
          next: (res: Employee) => {
            console.log(res);
            employeeForm.reset();
            this.clearForm(employeeForm);
            this.router.navigate(["/employee-list"]);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          }
        }
      );
    } else {
      this.employeeService.updateEmployee(this.employee, this.selectedFile).subscribe( // Update this line
        {
          next: (res: Employee) => {
            this.router.navigate(["/employee-list"]);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          }
        }
      );
    }
  }

  selectGender(gender: string): void {
    this.employee.employeeGender = gender;
  }

  onSkillsChanges(event: any): void {
    if (event.checked) {
      this.skills.push(event.source.value);
    } else {
      this.skills = this.skills.filter(skill => skill !== event.source.value);
    }
    this.employee.employeeSkills = this.skills.join(',');
  }

  clearForm(employeeForm: NgForm): void {
    employeeForm.resetForm({
      employeeId: this.employee.employeeId, // Preserve employeeId
      employeeName: '',
      employeeContactNumber: '',
      employeeAddress: '',
      employeeDepartment: '',
      employeeSkills: '',
      employeeGender: ''
    });
    this.skills = [];
    this.selectedFile = null; // Add this line
  }

  // Add this method
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}