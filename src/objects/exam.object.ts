import { CommonBaseObject } from './common.object';

export class ExamObject extends CommonBaseObject {
  id?: number;
  title?: string;
  description?: string;
  duration?: number; // in minutes
  passing_grade?: number; // in minutes
  config?: Record<string, any>;
  teacher?: any;
  question_pack?: any;
  exam_sessions?: any[];
  school_id?: number;
  school?: any;
}
