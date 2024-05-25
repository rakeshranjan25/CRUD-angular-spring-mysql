package com.example.crud.controller;

import com.example.crud.entity.Gender;
import com.example.crud.service.GenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genders")
@CrossOrigin(origins = "http://localhost:4200")
public class GenderController {

    @Autowired
    private GenderService genderService;

    @GetMapping
    public List<Gender> getAllGenders() {
        return genderService.getAllGenders();
    }
}
