import api from './api';
import { TagsResponse } from '../types';

export const tagsApi = {
  getAll: async (): Promise<string[]> => {
    const response = await api.get('/tags');
    return response.data.tags;
  },
};
