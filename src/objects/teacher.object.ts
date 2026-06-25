import { CommonBaseObject } from "./common.object";
import { ExamObject } from "./exam.object";
import { QuestionPackObject } from "./question-pack.object";
import { TestGroupObject } from "./test-group.object";
import { UserObject } from "./user.object";

export class TeacherObject extends CommonBaseObject {
  id?: number;
  nip?: string;
  specific_mastery?: string;
  question_pack?: QuestionPackObject[];
  test_group?: TestGroupObject[];
  exams?: ExamObject[];
  user?: UserObject;
}
