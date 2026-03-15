import api from '@/lib/api';

export interface ExamStructureDto {
  packId: string;
  count: number;
}

export interface CreateExamDto {
  name: string;
  structure: ExamStructureDto[];
  targetClasses: string[];
  duration: number;
  useQuestionTimer?: boolean;
}

export const examsService = {
  findAll: async () => {
    const response = await api.get('/exams');
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  create: async (data: CreateExamDto) => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/exams/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  getExamQuestions: async (id: string) => {
    const response = await api.get(`/exams/${id}/questions`);
    return response.data;
  },
};
