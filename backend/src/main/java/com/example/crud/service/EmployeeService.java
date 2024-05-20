package com.example.crud.service;

import com.example.crud.dao.EmployeeDao;
import com.example.crud.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;

    private final Path fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();

    public EmployeeService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Employee saveEmployee(Employee employee, MultipartFile file) {
        if (employee.getStatus() == null) {
            employee.setStatus("active");
        }

        Employee savedEmployee = employeeDao.save(employee);

        if (file != null && !file.isEmpty()) {
            String fileName = storeFile(file, employee.getEmployeeName(), savedEmployee.getEmployeeId());
            savedEmployee.setEmployeeFile(fileName);
            return employeeDao.save(savedEmployee);
        }

        return savedEmployee;
    }

    public List<Employee> getAllActiveEmployees() {
        return employeeDao.findByStatus("active");
    }

    public Page<Employee> getAllActiveEmployeesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeDao.findByStatus("active", pageable);
    }

    public Employee getEmployee(Integer employeeId) {
        return employeeDao.findById(employeeId.longValue()).orElseThrow();
    }

    public void deleteEmployee(Integer employeeId) {
        Employee employee = employeeDao.findById(employeeId.longValue()).orElseThrow();
        employee.setStatus("inactive");
        employeeDao.save(employee);
    }

    public Employee updateEmployee(Employee employee, MultipartFile file) {
        Employee existingEmployee = employeeDao.findById(employee.getEmployeeId().longValue()).orElseThrow();
        existingEmployee.setEmployeeName(employee.getEmployeeName());
        existingEmployee.setEmployeeContactNumber(employee.getEmployeeContactNumber());
        existingEmployee.setEmployeeAddress(employee.getEmployeeAddress());
        existingEmployee.setEmployeeGender(employee.getEmployeeGender());
        existingEmployee.setEmployeeDepartment(employee.getEmployeeDepartment());
        existingEmployee.setEmployeeSkills(employee.getEmployeeSkills());
        existingEmployee.setStatus(employee.getStatus());

        if (file != null && !file.isEmpty()) {
            String fileName = storeFile(file, employee.getEmployeeName(), employee.getEmployeeId());
            existingEmployee.setEmployeeFile(fileName);
        }

        return employeeDao.save(existingEmployee);
    }

    public Page<Employee> searchEmployees(String keyword, int page, int size) {
        return employeeDao.search(keyword, PageRequest.of(page, size));
    }

    public ResponseEntity<Resource> downloadEmployeeFile(Integer employeeId) {
        Employee employee = employeeDao.findById(employeeId.longValue()).orElseThrow();

        String fileName = employee.getEmployeeFile();
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();

        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", fileName);

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(resource);
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }

    private String storeFile(MultipartFile file, String employeeName, Integer employeeId) {
        String fileName = employeeName + "_" + employeeId + "_" + file.getOriginalFilename();
        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}
