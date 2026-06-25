import { CommonBaseObject } from "./common.object";
import { TeacherObject } from "./teacher.object";
import { StudentObject } from "./student.object";
import { ExamSessionObject } from "./exam-session.object";
import { SchoolObject } from "./school.object";

export class TestGroupObject extends CommonBaseObject {
    id?: number;
    name?: string;
    teacher?: TeacherObject;
    students?: StudentObject[];
    exam_sessions?: ExamSessionObject[];
    school_id?: number;
    school?: SchoolObject;
}