import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { MasterDataService } from '../services/master-data.service';
import { Employee } from '../Models/employee.model'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  dataSource: Employee[] = [];
  displayedColumns: string[] = ['serialNumber', 'employeeName', 'employeeContactNumber', 'employeeAddress', 'employeeDepartment', 'employeeGender', 'employeeSkills', 'file', 'edit', 'delete'];

  pageSize = 5;
  totalItems = 0;
  currentPage = 0;

  searchText: string = '';
  selectedDepartment: string = '';
  selectedGender: string = '';
  selectedSkill: string = '';

  departments: any[] = [];
  genders: any[] = [];
  skills: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService, private masterDataService: MasterDataService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployeeList();
    this.getMasterData();
  }

  updateEmployee(employeeId: number): void {
    this.router.navigate(['/employee', { employeeId: employeeId }]);
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.getEmployeeList();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  getEmployeeList(): void {
    if (this.searchText) {
      this.employeeService.searchEmployees(this.searchText, this.currentPage, this.pageSize).subscribe({
        next: (res: any) => {
          this.dataSource = res.content;
          this.totalItems = res.totalElements;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      });
    } else if (this.selectedDepartment || this.selectedGender || this.selectedSkill) {
      this.employeeService.getPaginatedFilteredEmployees(this.selectedDepartment, this.selectedGender, this.selectedSkill, this.currentPage, this.pageSize).subscribe({
        next: (res: any) => {
          this.dataSource = res.content;
          this.totalItems = res.totalElements;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      });
    } else {
      this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe({
        next: (res: any) => {
          this.dataSource = res.content;
          this.totalItems = res.totalElements;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      });
    }
  }

  getMasterData(): void {
    this.masterDataService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });

    this.masterDataService.getAllGenders().subscribe({
      next: (data) => {
        this.genders = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });

    this.masterDataService.getAllSkills().subscribe({
      next: (data) => {
        this.skills = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployeeList();
  }

  calculateSerialNumber(index: number): number {
    return index + 1 + (this.currentPage * this.pageSize);
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.getEmployeeList();
  }

  downloadEmployeeFile(employeeId: number, fileName: string): void {
    this.employeeService.downloadEmployeeFile(employeeId, fileName).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }, (error: any) => {
      console.log('Error downloading file:', error);
    });
  }

  getSkillsAsString(employee: Employee): string {
    return employee.employeeSkills.map(skill => skill.name).join(', ');
  }

  onDepartmentChange(event: MatSelectChange): void {
    this.selectedDepartment = event.value;
    this.applyFilter();
  }

  onGenderChange(event: MatSelectChange): void {
    this.selectedGender = event.value;
    this.applyFilter();
  }

  onSkillChange(event: MatSelectChange): void {
    this.selectedSkill = event.value;
    this.applyFilter();
  }

  downloadPdf(): void {
    this.employeeService.getFilteredEmployees(this.selectedDepartment, this.selectedGender, this.selectedSkill).subscribe((employees: Employee[]) => {
      const doc = new jsPDF();
      const data = employees.map((employee, index) => [
        index + 1,
        employee.employeeName,
        employee.employeeContactNumber,
        employee.employeeAddress,
        employee.employeeDepartment.name,
        employee.employeeGender.name,
        this.getSkillsAsString(employee),
      ]);
      autoTable(doc, {
        head: [['S.N.', 'Name', 'Contact', 'Address', 'Department', 'Gender', 'Skills']],
        body: data,
      });
      doc.save('employee-list.pdf');
    });
  }

  downloadExcel(): void {
    this.employeeService.getFilteredEmployees(this.selectedDepartment, this.selectedGender, this.selectedSkill).subscribe((employees: Employee[]) => {
      const data = employees.map((employee, index) => ({
        'S.N.': index + 1,
        'Name': employee.employeeName,
        'Contact': employee.employeeContactNumber,
        'Address': employee.employeeAddress,
        'Department': employee.employeeDepartment.name,
        'Gender': employee.employeeGender.name,
        'Skills': this.getSkillsAsString(employee),
      }));
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      XLSX.writeFile(wb, 'employee-list.xlsx');
    });
  }
}
