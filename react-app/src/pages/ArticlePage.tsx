import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { articlesApi } from '../services/articles';
import { Article } from '../types';
import { FavoriteButton } from '../components/FavoriteButton';
import { FollowButton } from '../components/FollowButton';
import { ShowAuthed } from '../components/ShowAuthed';
import { CommentSection } from '../components/CommentSection';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        const articleData = await articlesApi.get(slug);
        setArticle(articleData);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, navigate]);

  const handleDelete = async () => {
    if (!article || !window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articlesApi.delete(article.slug);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
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
    return <div className="article-page">Loading article...</div>;
  }

  if (!article) {
    return <div className="article-page">Article not found</div>;
  }

  const isOwner = user?.username === article.author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <Link to={`/@${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </Link>
            <div className="info">
              <Link to={`/@${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{formatDate(article.createdAt)}</span>
            </div>

            <ShowAuthed when={true}>
              {isOwner ? (
                <span>
                  <Link
                    to={`/editor/${article.slug}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="ion-edit"></i> Edit Article
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDelete}
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </span>
              ) : (
                <span>
                  <FollowButton profile={article.author} />
                  <FavoriteButton article={article} onUpdate={setArticle}>
                    Favorite Article
                  </FavoriteButton>
                </span>
              )}
            </ShowAuthed>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{ __html: article.body }} />
            {article.tagList.length > 0 && (
              <ul className="tag-list">
                {article.tagList.map((tag) => (
                  <li key={tag} className="tag-default tag-pill tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr />

        <CommentSection articleSlug={article.slug} />
      </div>
    </div>
  );
};
