import { QuestionTypeEnum } from "@/enums/question.enum";
import { CommonBaseObject } from "./common.object";

export class QuestionObject extends CommonBaseObject{
    id?: number;
    text?: string;
    question_type?: QuestionTypeEnum;
    explanation?: string;
    question_packs?: any[];
    options?: any[];
}