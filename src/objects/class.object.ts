import { CommonBaseObject } from "./common.object";
import { SchoolObject } from "./school.object";
import { StudentObject } from "./student.object";

export class ClassObject extends CommonBaseObject {
    id?: number;
    name?: string;
    students?: StudentObject[];
    school_id?: number;
    school?: SchoolObject;
}