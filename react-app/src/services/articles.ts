import api from './api';
import { Article, ArticlesResponse, ListConfig } from '../types';

export const articlesApi = {
  query: async (config: ListConfig): Promise<ArticlesResponse> => {
    const url = config.type === 'feed' ? '/articles/feed' : '/articles';
    const response = await api.get(url, { params: config.filters });
    return response.data;
  },

  get: async (slug: string): Promise<Article> => {
    const response = await api.get(`/articles/${slug}`);
    return response.data.article;
  },

  create: async (article: Partial<Article>): Promise<Article> => {
    const response = await api.post('/articles', { article });
    return response.data.article;
  },

  update: async (slug: string, article: Partial<Article>): Promise<Article> => {
    const response = await api.put(`/articles/${slug}`, { article });
    return response.data.article;
  },

  delete: async (slug: string): Promise<void> => {
    await api.delete(`/articles/${slug}`);
  },

  favorite: async (slug: string): Promise<Article> => {
    const response = await api.post(`/articles/${slug}/favorite`);
    return response.data.article;
  },

  unfavorite: async (slug: string): Promise<Article> => {
    const response = await api.delete(`/articles/${slug}/favorite`);
    return response.data.article;
  },
};
