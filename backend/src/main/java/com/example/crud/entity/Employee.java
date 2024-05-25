package com.example.crud.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer employeeId;

    @Column(name = "status")
    private String status;

    private String employeeName;

    private String employeeContactNumber;

    private String employeeAddress;

    @ManyToOne
    @JoinColumn(name = "employee_gender_id")
    private Gender employeeGender;

    @ManyToOne
    @JoinColumn(name = "employee_department_id")
    private Department employeeDepartment;

    @ManyToMany
    @JoinTable(
            name = "employee_skills",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skill> employeeSkills;

    @Column(name = "employee_file")
    private String employeeFile;

    public Employee() {
    }

    // Getters and Setters

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeContactNumber() {
        return employeeContactNumber;
    }

    public void setEmployeeContactNumber(String employeeContactNumber) {
        this.employeeContactNumber = employeeContactNumber;
    }

    public String getEmployeeAddress() {
        return employeeAddress;
    }

    public void setEmployeeAddress(String employeeAddress) {
        this.employeeAddress = employeeAddress;
    }

    public Gender getEmployeeGender() {
        return employeeGender;
    }

    public void setEmployeeGender(Gender employeeGender) {
        this.employeeGender = employeeGender;
    }

    public Department getEmployeeDepartment() {
        return employeeDepartment;
    }

    public void setEmployeeDepartment(Department employeeDepartment) {
        this.employeeDepartment = employeeDepartment;
    }

    public List<Skill> getEmployeeSkills() {
        return employeeSkills;
    }

    public void setEmployeeSkills(List<Skill> employeeSkills) {
        this.employeeSkills = employeeSkills;
    }

    public String getEmployeeFile() {
        return employeeFile;
    }

    public void setEmployeeFile(String employeeFile) {
        this.employeeFile = employeeFile;
    }
}
