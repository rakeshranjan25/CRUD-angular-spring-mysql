import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../employee.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  dataSource: Employee[] = [];
  originalDataSource: Employee[] = []; // Store original data source
  filteredDataSource: Employee[] = []; // Store filtered data
  displayedColumns: string[] = ['serialNumber', 'employeeName', 'employeeContactNumber', 'employeeAddress', 'employeeDepartment', 'employeeGender', 'employeeSkills', 'file', 'edit', 'delete']; // Added 'file' column

  // Paginator properties
  pageSize = 5;
  totalItems = 0;
  currentPage = 0;

  searchText: string = ''; // Holds the value of the search input

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  updateEmployee(employeeId: number): void {
    this.router.navigate(['/employee', { employeeId: employeeId }]);
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (res) => {
        console.log(res);
        this.getEmployeeList(); // Refresh the employee list after deletion
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  getEmployeeList(): void {
    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.dataSource = res.content;
        this.originalDataSource = res.content.slice(); // Store original data
        this.totalItems = res.totalElements;

        // Initialize filteredDataSource with original data
        this.filteredDataSource = this.originalDataSource.slice();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployeeList(); // Fetch data for the new page
  }

  calculateSerialNumber(index: number): number {
    return index + 1 + (this.currentPage * this.pageSize);
  }

  applyFilter(): void {
    let filterValue = this.searchText.trim().toLowerCase(); // Convert input to lowercase

    // If filter value is empty, reset the dataSource to the original data
    if (!filterValue) {
      this.currentPage = 0; // Reset currentPage to fetch data from the beginning
      this.getEmployeeList(); // Fetch data with pagination
      return;
    }

    // Perform search with filter value
    this.employeeService.searchEmployees(filterValue, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.dataSource = res.content;
        this.totalItems = res.totalElements;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
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
  
}
