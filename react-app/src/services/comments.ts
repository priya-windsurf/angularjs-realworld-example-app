import api from './api';
import { Comment } from '../types';

export const commentsApi = {
  getAll: async (articleSlug: string): Promise<Comment[]> => {
    const response = await api.get(`/articles/${articleSlug}/comments`);
    return response.data.comments;
  },

  create: async (articleSlug: string, comment: { body: string }): Promise<Comment> => {
    const response = await api.post(`/articles/${articleSlug}/comments`, { comment });
    return response.data.comment;
  },

  delete: async (articleSlug: string, commentId: number): Promise<void> => {
    await api.delete(`/articles/${articleSlug}/comments/${commentId}`);
  },
};
