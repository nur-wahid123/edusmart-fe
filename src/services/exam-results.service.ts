import api from '@/lib/api';

export interface CreateExamResultDto {
  studentName: string;
  studentId: string;
  className: string;
  examId: string;
  examName: string;
  teacherId: string;
  questions: any[];
}

export interface UpdateExamResultDto {
  answers?: any;
  violationCount?: number;
}

export interface SubmitExamDto {
  answers: any;
}

export const examResultsService = {
  create: async (data: CreateExamResultDto) => {
    const response = await api.post('/exam-results', data);
    return response.data;
  },

  update: async (id: string, data: UpdateExamResultDto) => {
    const response = await api.put(`/exam-results/${id}`, data);
    return response.data;
  },

  submit: async (id: string, data: SubmitExamDto) => {
    const response = await api.post(`/exam-results/${id}/submit`, data);
    return response.data;
  },

  findByStudent: async (studentId: string) => {
    const response = await api.get(`/exam-results/student/${studentId}`);
    return response.data;
  },

  findByExam: async (examId: string) => {
    const response = await api.get(`/exam-results/exam/${examId}`);
    return response.data;
  },

  findByTeacher: async (teacherId: string) => {
    const response = await api.get(`/exam-results/teacher/${teacherId}`);
    return response.data;
  },

  forceSubmit: async (id: string) => {
    const response = await api.post(`/exam-results/${id}/force-submit`);
    return response.data;
  },

  exportToExcel: async (examId: string) => {
    const response = await api.get(`/exam-results/export/${examId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteByExam: async (examId: string) => {
    const response = await api.delete(`/exam-results/exam/${examId}`);
    return response.data;
  },
};
