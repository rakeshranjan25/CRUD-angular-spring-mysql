package com.example.crud.service;

import com.example.crud.dao.GenderRepository;
import com.example.crud.entity.Gender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderService {
    @Autowired
    private GenderRepository genderRepository;

    public List<Gender> getAllGenders() {
        return genderRepository.findAll();
    }

    public Gender getGenderById(Long id) {
        return genderRepository.findById(id).orElseThrow(() -> new RuntimeException("Gender not found"));
    }
}
