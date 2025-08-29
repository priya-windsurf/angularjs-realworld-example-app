import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { commentsApi } from '../services/comments';
import { Comment } from '../types';

interface CommentSectionProps {
  articleSlug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleSlug }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await commentsApi.getAll(articleSlug);
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const comment = await commentsApi.create(articleSlug, { body: newComment });
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentsApi.delete(articleSlug, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        {user && (
          <form className="card comment-form" onSubmit={handleSubmit}>
            <div className="card-block">
              <textarea
                className="form-control"
                placeholder="Write a comment..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="card-footer">
              <img src={user.image} className="comment-author-img" alt="" />
              <button
                className="btn btn-sm btn-primary"
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
              >
                Post Comment
              </button>
            </div>
          </form>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="card">
            <div className="card-block">
              <p className="card-text">{comment.body}</p>
            </div>
            <div className="card-footer">
              <a href={`/@${comment.author.username}`} className="comment-author">
                <img src={comment.author.image} className="comment-author-img" alt="" />
              </a>
              &nbsp;
              <a href={`/@${comment.author.username}`} className="comment-author">
                {comment.author.username}
              </a>
              <span className="date-posted">{formatDate(comment.createdAt)}</span>
              {user?.username === comment.author.username && (
                <span className="mod-options">
                  <i
                    className="ion-trash-a"
                    onClick={() => handleDelete(comment.id)}
                  ></i>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
