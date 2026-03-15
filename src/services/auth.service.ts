import api from '@/lib/api';

export interface TeacherLoginDto {
  teacherId: string;
  pin: string;
}

export interface ChangePinDto {
  newPin: string;
}

export const authService = {
  login: async (data: TeacherLoginDto) => {
    const response = await api.post('/auth/login', data);
    if (response.data.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.access_token);
      }
    }
    return response.data;
  },

  changePin: async (data: ChangePinDto) => {
    return api.patch('/auth/change-pin', data);
  },

  getAllPins: async () => {
    const response = await api.get('/auth/pins');
    return response.data;
  },

  getValidIds: async () => {
    const response = await api.get('/auth/valid-ids');
    return response.data;
  },
};
