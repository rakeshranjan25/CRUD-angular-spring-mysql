package com.example.crud.controller;

import com.example.crud.entity.Employee;
import com.example.crud.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/employees")
    public ResponseEntity<Employee> saveEmployee(
            @RequestParam("employee") String employeeString,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Employee employee = objectMapper.readValue(employeeString, Employee.class);
            Employee savedEmployee = employeeService.saveEmployee(employee, file);
            return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();  // Add this line to log the error
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/employees")
    public ResponseEntity<Page<Employee>> getActiveEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Employee> activeEmployees = employeeService.getAllActiveEmployeesPaginated(page, size);
        return new ResponseEntity<>(activeEmployees, HttpStatus.OK);
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Integer employeeId) {
        Employee employee = employeeService.getEmployee(employeeId);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer employeeId) {
        employeeService.deleteEmployee(employeeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Integer employeeId,
            @RequestParam("employee") String employeeString,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Employee employee = new ObjectMapper().readValue(employeeString, Employee.class);
            employee.setEmployeeId(employeeId);
            Employee updatedEmployee = employeeService.updateEmployee(employee, file);
            return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/employees/search")
    public ResponseEntity<Page<Employee>> searchEmployees(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Employee> searchResult = employeeService.searchEmployees(keyword, page, size);
        return new ResponseEntity<>(searchResult, HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Employee>> filterEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String skill,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Employee> filteredResult = employeeService.filterEmployeesByDepartmentGenderSkill(department, gender, skill, page, size);
        return new ResponseEntity<>(filteredResult, HttpStatus.OK);
    }

    @GetMapping("/filter/all")
    public ResponseEntity<List<Employee>> getFilteredEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String skill) {
        List<Employee> filteredResult = employeeService.getFilteredEmployees(department, gender, skill);
        return new ResponseEntity<>(filteredResult, HttpStatus.OK);
    }

    @GetMapping("/employees/{employeeId}/file")
    public ResponseEntity<Resource> downloadEmployeeFile(@PathVariable Integer employeeId) {
        return employeeService.downloadEmployeeFile(employeeId);
    }
}
