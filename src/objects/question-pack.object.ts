import { CommonBaseObject } from './common.object';
import { ExamObject } from './exam.object';
import { SchoolObject } from './school.object';
import { QuestionObject } from './question.object';
import { TeacherObject } from './teacher.object';

export class QuestionPackObject extends CommonBaseObject {
  id?: number;
  name?: string;
  questions?: QuestionObject[]; // Array of question objects
  teacher?: TeacherObject;
  exams?: ExamObject[];
  school_id?: number;
  school?: SchoolObject;
}
