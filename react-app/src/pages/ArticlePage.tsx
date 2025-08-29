import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import articlesService, { Article } from '../services/articlesService';
import commentsService, { Comment } from '../services/commentsService';
import profileService from '../services/profileService';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
      loadComments();
    }
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;
    
    try {
      const response = await articlesService.getArticle(slug);
      setArticle(response.article);
    } catch (error) {
      console.error('Failed to load article:', error);
    }
  };

  const loadComments = async () => {
    if (!slug) return;
    
    try {
      const response = await commentsService.getComments(slug);
      setComments(response.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleFavorite = async () => {
    if (!article || !slug) return;
    
    try {
      let response;
      if (article.favorited) {
        response = await articlesService.unfavoriteArticle(slug);
      } else {
        response = await articlesService.favoriteArticle(slug);
      }
      setArticle(response.article);
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const handleFollow = async () => {
    if (!article) return;
    
    try {
      let response;
      if (article.author.following) {
        response = await profileService.unfollowUser(article.author.username);
      } else {
        response = await profileService.followUser(article.author.username);
      }
      setArticle(prev => prev ? {
        ...prev,
        author: { ...prev.author, following: response.profile.following }
      } : null);
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  const handleDeleteArticle = async () => {
    if (!slug || !window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await articlesService.deleteArticle(slug);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentBody.trim()) return;
    
    setSubmittingComment(true);
    try {
      await commentsService.createComment(slug, commentBody);
      setCommentBody('');
      loadComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!slug || !window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await commentsService.deleteComment(slug, commentId);
      loadComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  const isAuthor = user?.username === article.author.username;
  const createdDate = new Date(article.createdAt).toLocaleDateString();

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{createdDate}</span>
            </div>
            
            {isAuthor ? (
              <>
                <Link
                  to={`/editor/${article.slug}`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="ion-edit"></i> Edit Article
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDeleteArticle}
                >
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <button
                  className={`btn btn-sm ${
                    article.author.following ? 'btn-secondary' : 'btn-outline-secondary'
                  }`}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                </button>
                <button
                  className={`btn btn-sm ${
                    article.favorited ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={handleFavorite}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {article.favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
                  <span className="counter">({article.favoritesCount})</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            
            <ul className="tag-list">
              {article.tagList.map((tag, index) => (
                <li key={index} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{createdDate}</span>
            </div>
            
            {isAuthor ? (
              <>
                <Link
                  to={`/editor/${article.slug}`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="ion-edit"></i> Edit Article
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDeleteArticle}
                >
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <button
                  className={`btn btn-sm ${
                    article.author.following ? 'btn-secondary' : 'btn-outline-secondary'
                  }`}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                </button>
                <button
                  className={`btn btn-sm ${
                    article.favorited ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={handleFavorite}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {article.favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
                  <span className="counter">({article.favoritesCount})</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handleSubmitComment}>
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows={3}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img src={user?.image} className="comment-author-img" alt="" />
                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={submittingComment || !commentBody.trim()}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2">
                  <p>
                    <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments on this article.
                  </p>
                </div>
              </div>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className="card">
                <div className="card-block">
                  <p className="card-text">{comment.body}</p>
                </div>
                <div className="card-footer">
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    <img src={comment.author.image} className="comment-author-img" alt="" />
                  </Link>
                  &nbsp;
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    {comment.author.username}
                  </Link>
                  <span className="date-posted">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {user?.username === comment.author.username && (
                    <span className="mod-options">
                      <i
                        className="ion-trash-a"
                        onClick={() => handleDeleteComment(comment.id)}
                      ></i>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
