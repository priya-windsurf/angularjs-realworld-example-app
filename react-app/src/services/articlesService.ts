import api from './api';

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface ArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CreateArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface UpdateArticleData {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface ArticleFilters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

class ArticlesService {
  async getArticles(filters: ArticleFilters = {}): Promise<ArticlesResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/articles?${params.toString()}`);
    return response.data;
  }

  async getFeedArticles(limit = 20, offset = 0): Promise<ArticlesResponse> {
    const response = await api.get(`/articles/feed?limit=${limit}&offset=${offset}`);
    return response.data;
  }

  async getArticle(slug: string): Promise<ArticleResponse> {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  }

  async createArticle(articleData: CreateArticleData): Promise<ArticleResponse> {
    const response = await api.post('/articles', { article: articleData });
    return response.data;
  }

  async updateArticle(slug: string, articleData: UpdateArticleData): Promise<ArticleResponse> {
    const response = await api.put(`/articles/${slug}`, { article: articleData });
    return response.data;
  }

  async deleteArticle(slug: string): Promise<void> {
    await api.delete(`/articles/${slug}`);
  }

  async favoriteArticle(slug: string): Promise<ArticleResponse> {
    const response = await api.post(`/articles/${slug}/favorite`);
    return response.data;
  }

  async unfavoriteArticle(slug: string): Promise<ArticleResponse> {
    const response = await api.delete(`/articles/${slug}/favorite`);
    return response.data;
  }

  async getTags(): Promise<{ tags: string[] }> {
    const response = await api.get('/tags');
    return response.data;
  }
}

export default new ArticlesService();
