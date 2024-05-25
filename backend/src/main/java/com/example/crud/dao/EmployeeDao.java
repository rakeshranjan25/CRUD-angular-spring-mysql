package com.example.crud.dao;

import com.example.crud.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeDao extends JpaRepository<Employee, Long> {
    Page<Employee> findAll(Pageable pageable);
    List<Employee> findByStatus(String status);
    Page<Employee> findByStatus(String status, Pageable pageable);

    @Query("SELECT e FROM Employee e " +
            "LEFT JOIN e.employeeSkills s " +
            "WHERE lower(e.employeeName) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeContactNumber) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeAddress) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(e.employeeDepartment.name) LIKE lower(concat('%', :keyword, '%')) " +
            "OR lower(s.name) LIKE lower(concat('%', :keyword, '%'))")
    Page<Employee> search(String keyword, Pageable pageable);

    @Query("SELECT DISTINCT e FROM Employee e " +
            "LEFT JOIN e.employeeSkills s " +
            "WHERE (:department IS NULL OR e.employeeDepartment.name = :department) " +
            "AND (:gender IS NULL OR e.employeeGender.name = :gender) " +
            "AND (:skill IS NULL OR s.name = :skill)")
    Page<Employee> filterByDepartmentGenderSkill(@Param("department") String department,
                                                 @Param("gender") String gender,
                                                 @Param("skill") String skill,
                                                 Pageable pageable);

    @Query("SELECT DISTINCT e FROM Employee e " +
            "LEFT JOIN e.employeeSkills s " +
            "WHERE (:department IS NULL OR e.employeeDepartment.name = :department) " +
            "AND (:gender IS NULL OR e.employeeGender.name = :gender) " +
            "AND (:skill IS NULL OR s.name = :skill)")
    List<Employee> filterByDepartmentGenderSkill(@Param("department") String department,
                                                 @Param("gender") String gender,
                                                 @Param("skill") String skill);
}
