import api from '@/lib/api';

export interface CreateQuestionPackDto {
  name: string;
  questions: any[];
  level: string;
}

export interface UpdateQuestionPackDto {
  name?: string;
  questions?: any[];
  level?: string;
}

export interface GenerateAIDto {
  topic: string;
  level: string;
  specificClass: string;
  count: number;
  customPrompt?: string;
}

export const questionPacksService = {
  findAll: async () => {
    const response = await api.get('/question-packs');
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await api.get(`/question-packs/${id}`);
    return response.data;
  },

  create: async (data: CreateQuestionPackDto) => {
    const response = await api.post('/question-packs', data);
    return response.data;
  },

  update: async (id: string, data: UpdateQuestionPackDto) => {
    const response = await api.put(`/question-packs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/question-packs/${id}`);
    return response.data;
  },

  importFromText: async (text: string) => {
    const response = await api.post('/question-packs/import-text', { text });
    return response.data;
  },

  importFromFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/question-packs/import-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  generateAI: async (data: GenerateAIDto) => {
    const response = await api.post('/question-packs/generate-ai', data);
    return response.data;
  },
};
