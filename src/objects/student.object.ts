import { ClassObject } from "./class.object";
import { CommonBaseObject } from "./common.object";
import { ExamAttemptObject } from "./exam-attempt.object";
import { SchoolObject } from "./school.object";
import { TestGroupObject } from "./test-group.object";

export class StudentObject extends CommonBaseObject {
  id?: number;
  name?: string;
  student_id?: string;
  student_class?: ClassObject;
  test_groups?: TestGroupObject[];
  exam_attempt?: ExamAttemptObject[];
  school_id?: number;
  school?: SchoolObject;
}
