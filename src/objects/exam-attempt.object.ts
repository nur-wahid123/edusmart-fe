import { CommonBaseObject } from "./common.object";

export class ExamAttemptObject extends CommonBaseObject {
  id?: number;
  start_at?: Date;
  submit_at?: Date;
  status?: any;
  score?: string;
  is_passed?: boolean;
  violation_count?: number;
  student?: any;
  exam_session?: any;
}
