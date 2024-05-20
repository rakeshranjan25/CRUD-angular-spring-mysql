package com.example.crud.dao;

import com.example.crud.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeDao extends JpaRepository<Employee, Long> {
    Page<Employee> findAll(Pageable pageable);
    List<Employee> findByStatus(String status);
    Page<Employee> findByStatus(String status, Pageable pageable);

    @Query("SELECT e FROM Employee e " +
            "WHERE lower(e.employeeName) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeContactNumber) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeAddress) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeDepartment) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeSkills) LIKE lower(concat('%', :keyword, '%'))")
    Page<Employee> search(String keyword, Pageable pageable);
}
