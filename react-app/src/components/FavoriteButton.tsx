import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { articlesApi } from '../services/articles';
import { Article } from '../types';

interface FavoriteButtonProps {
  article: Article;
  onUpdate: (article: Article) => void;
  children?: React.ReactNode;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  article, 
  onUpdate, 
  children 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      navigate('/register');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedArticle = article.favorited
        ? await articlesApi.unfavorite(article.slug)
        : await articlesApi.favorite(article.slug);
      onUpdate(updatedArticle);
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <i className="ion-heart"></i>
      {children && <span> {children}</span>}
      <span className="counter"> ({article.favoritesCount})</span>
    </button>
  );
};
