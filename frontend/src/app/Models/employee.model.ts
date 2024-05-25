import { Department } from './department.model';
import { Gender } from './gender.model';
import { Skill } from './skill.model';

export interface Employee {
  employeeId?: number;
  status?: string;
  employeeName: string;
  employeeContactNumber: string;
  employeeAddress: string;
  employeeGender: Gender;
  employeeDepartment: Department;
  employeeSkills: Skill[];
  employeeFile?: string;
}
