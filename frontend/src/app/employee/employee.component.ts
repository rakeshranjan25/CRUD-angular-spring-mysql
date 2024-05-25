import { Component, OnInit } from '@angular/core';
import { Employee } from '../Models/employee.model'; 
import { Department } from '../Models/department.model'; 
import { Gender } from '../Models/gender.model'; 
import { Skill } from '../Models/skill.model'; 
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MasterDataService } from '../services/master-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  isCreateEmployee: boolean = true;
  employee: Employee = {
    employeeId: 0,
    employeeName: '',
    employeeContactNumber: '',
    employeeAddress: '',
    employeeGender: { id: 0, name: '' },
    employeeDepartment: { id: 0, name: '' },
    employeeSkills: []
  };
  departments: Department[] = [];
  genders: Gender[] = [];
  skills: Skill[] = [];
  selectedSkills: Set<number> = new Set<number>();
  selectedFile: File | null = null;

  constructor(
    private employeeService: EmployeeService,
    private masterDataService: MasterDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMasterData();
    const resolvedEmployee = this.activatedRoute.snapshot.data['employee'];
    if (resolvedEmployee) {
      this.employee = resolvedEmployee;
      if (this.employee.employeeId && this.employee.employeeId > 0) {
        this.isCreateEmployee = false;
        this.employee.employeeSkills.forEach(skill => this.selectedSkills.add(skill.id));
      }
    }
  }

  loadMasterData() {
    this.masterDataService.getAllDepartments().subscribe(data => {
      this.departments = data;
    });

    this.masterDataService.getAllGenders().subscribe(data => {
      this.genders = data;
    });

    this.masterDataService.getAllSkills().subscribe(data => {
      this.skills = data;
    });
  }

  onSkillsChanges(event: any, skill: Skill): void {
    if (event.checked) {
      this.selectedSkills.add(skill.id);
    } else {
      this.selectedSkills.delete(skill.id);
    }
    this.employee.employeeSkills = Array.from(this.selectedSkills).map(id => this.skills.find(skill => skill.id === id)!);
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
      this.employeeService.saveEmployee(this.employee, this.selectedFile).subscribe(
        {
          next: (res: Employee) => {
            console.log(res);
            employeeForm.reset();
            this.clearForm(employeeForm);
            this.router.navigate(["/employee-list"]);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error:', err);
            console.error('Error message:', err.message);
          }
        }
      );
    } else {
      this.employeeService.updateEmployee(this.employee, this.selectedFile).subscribe(
        {
          next: (res: Employee) => {
            this.router.navigate(["/employee-list"]);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error:', err);
            console.error('Error message:', err.message);
          }
        }
      );
    }
  }

  clearForm(employeeForm: NgForm): void {
    employeeForm.resetForm({
      employeeId: this.employee.employeeId,
      employeeName: '',
      employeeContactNumber: '',
      employeeAddress: '',
      employeeGender: { id: 0, name: '' },
      employeeDepartment: { id: 0, name: '' },
      employeeSkills: []
    });
    this.selectedSkills.clear();
    this.selectedFile = null;
  }

  selectGender(gender: Gender): void {
    this.employee.employeeGender = gender;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const maxFileSize = 100 * 1024; // 200KB in bytes

    if (file.size > maxFileSize) {
      alert('File size is large, Please upload a file under 100KB');
      window.location.reload(); // Refresh the page
    } else {
      this.selectedFile = file;
    }
  }

  getSelectedSkills(): string[] {
    return Array.from(this.selectedSkills)
      .map(id => this.skills.find(skill => skill.id === id)?.name)
      .filter(name => name) as string[];
  }
}
