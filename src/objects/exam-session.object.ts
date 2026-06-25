import { CommonBaseObject } from './common.object';
import { ExamAttemptObject } from './exam-attempt.object';
import { ExamObject } from './exam.object';
import { SchoolObject } from './school.object';
import { TestGroupObject } from './test-group.object';

export class ExamSessionObject extends CommonBaseObject {
  id?: number;
  code?: string;
  start_at?: Date;
  end_at?: Date;
  is_active?: boolean;
  test_group?: TestGroupObject;
  exam?: ExamObject;
  exam_attempts?: ExamAttemptObject[];
  school_id?: number;
  school?: SchoolObject;
}
