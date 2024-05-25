package com.example.crud.service;

import com.example.crud.dao.SkillRepository;
import com.example.crud.entity.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public List<Skill> getSkillsByIds(List<Long> ids) {
        return skillRepository.findAllById(ids);
    }
}
