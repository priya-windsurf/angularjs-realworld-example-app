import React, { useState, useEffect } from 'react';
import { articlesApi } from '../services/articles';
import { Article, ListConfig } from '../types';
import { ArticlePreview } from './ArticlePreview';
import { Pagination } from './Pagination';

interface ArticleListProps {
  config: ListConfig;
  limit: number;
  onConfigChange: (config: ListConfig) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ config, limit, onConfigChange }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const queryConfig = {
          type: config.type,
          filters: {
            ...config.filters,
            limit,
            offset: limit * ((config.currentPage || 1) - 1),
          },
        };

        const response = await articlesApi.query(queryConfig);
        setArticles(response.articles);
        setTotalPages(Math.ceil(response.articlesCount / limit));
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [config, limit]);

  const handlePageChange = (page: number) => {
    onConfigChange({ ...config, currentPage: page });
  };

  const handleArticleUpdate = (updatedArticle: Article) => {
    setArticles(prev =>
      prev.map(article =>
        article.slug === updatedArticle.slug ? updatedArticle : article
      )
    );
  };

  if (loading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <ArticlePreview
          key={article.slug}
          article={article}
          onUpdate={handleArticleUpdate}
        />
      ))}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={config.currentPage || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};
