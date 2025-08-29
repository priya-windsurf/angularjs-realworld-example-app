import api from './api';
import { User, LoginCredentials, RegisterCredentials } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/users/login', { user: credentials });
    return response.data.user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post('/users', { user: credentials });
    return response.data.user;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/user');
    return response.data.user;
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/user', { user: userData });
    return response.data.user;
  },
};
