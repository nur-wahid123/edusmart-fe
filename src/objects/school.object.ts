import { CommonBaseObject } from "./common.object";
import { ClassObject } from "./class.object";
import { StudentObject } from "./student.object";
import { UserObject } from "./user.object";

export class SchoolObject extends CommonBaseObject {
  id?: number;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  start_date?: string;
  description?: string;
  is_demo?: boolean;
  is_active?: boolean;
  image?: number;
  teachers_limit?: number;
  questions_limit?: number;
  question_packs_limit?: number;
  students_limit?: number;
  classes?: ClassObject[];
  students?: StudentObject[];
  users?: UserObject[];
}
