import api from '@/lib/api';

export interface CreateStudentDto {
  name: string;
  class: string;
}

export const studentsService = {
  findAll: async (teacherId?: string) => {
    if (teacherId) {
      const response = await api.get(`/students/by-teacher/${teacherId}`);
      return response.data;
    }
    const response = await api.get('/students');
    return response.data;
  },

  findByClass: async (className: string) => {
    const response = await api.get(`/students/by-class?class=${encodeURIComponent(className)}`);
    return response.data;
  },

  create: async (data: CreateStudentDto) => {
    const response = await api.post('/students', data);
    return response.data;
  },

  bulkCreate: async (students: CreateStudentDto[]) => {
    const response = await api.post('/students/bulk', { students });
    return response.data;
  },

  importCSV: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/students/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: string[]) => {
    const response = await api.delete('/students/bulk', { data: { ids } });
    return response.data;
  },
};
