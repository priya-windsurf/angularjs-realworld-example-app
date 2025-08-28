import api from './api';

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface CommentResponse {
  comment: Comment;
}

export interface CommentsResponse {
  comments: Comment[];
}

class CommentsService {
  async getComments(slug: string): Promise<CommentsResponse> {
    const response = await api.get(`/articles/${slug}/comments`);
    return response.data;
  }

  async createComment(slug: string, body: string): Promise<CommentResponse> {
    const response = await api.post(`/articles/${slug}/comments`, {
      comment: { body }
    });
    return response.data;
  }

  async deleteComment(slug: string, commentId: number): Promise<void> {
    await api.delete(`/articles/${slug}/comments/${commentId}`);
  }
}

export default new CommentsService();
