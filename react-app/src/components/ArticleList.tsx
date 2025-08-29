import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { Article } from '../services/articlesService';
import articlesService from '../services/articlesService';
import profileService from '../services/profileService';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleFavorite = async (slug: string, favorited: boolean) => {
    if (!isAuthenticated) return;
    
    try {
      if (favorited) {
        await articlesService.unfavoriteArticle(slug);
      } else {
        await articlesService.favoriteArticle(slug);
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    }
  };

  const handleFollow = async (username: string, following: boolean) => {
    if (!isAuthenticated) return;
    
    try {
      if (following) {
        await profileService.unfollowUser(username);
      } else {
        await profileService.followUser(username);
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <div key={article.slug} className="article-preview">
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className={`btn btn-outline-primary btn-sm pull-xs-right ${
                article.favorited ? 'active' : ''
              }`}
              onClick={() => handleFavorite(article.slug, article.favorited)}
              disabled={!isAuthenticated}
            >
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map((tag, index) => (
                <li key={index} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
