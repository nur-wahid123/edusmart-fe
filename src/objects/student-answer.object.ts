import { CommonBaseObject } from "./common.object";

export class StudentAnswerObject extends CommonBaseObject {
    id?: number;
    exam_attempt?: any;
    question?: any;
    is_correct?: boolean;
    points_earned?: string;
    answer?: Record<string, any>;
}