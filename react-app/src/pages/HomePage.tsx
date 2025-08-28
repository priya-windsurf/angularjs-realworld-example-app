import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import articlesService, { Article } from '../services/articlesService';
import ArticleList from '../components/ArticleList';
import TagList from '../components/TagList';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'feed' | 'tag'>('global');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const articlesPerPage = 10;

  useEffect(() => {
    loadTags();
    if (isAuthenticated && activeTab === 'global') {
      setActiveTab('feed');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadArticles();
  }, [activeTab, selectedTag, currentPage]);

  const loadTags = async () => {
    try {
      const response = await articlesService.getTags();
      setTags(response.tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * articlesPerPage;
      let response;

      if (activeTab === 'feed') {
        response = await articlesService.getFeedArticles(articlesPerPage, offset);
      } else {
        const filters = {
          limit: articlesPerPage,
          offset,
          ...(selectedTag && { tag: selectedTag }),
        };
        response = await articlesService.getArticles(filters);
      }

      setArticles(response.articles);
      setArticlesCount(response.articlesCount);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'global' | 'feed' | 'tag') => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab !== 'tag') {
      setSelectedTag('');
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('tag');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(articlesCount / articlesPerPage);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
                      onClick={() => handleTabChange('feed')}
                    >
                      Your Feed
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'global' ? 'active' : ''}`}
                    onClick={() => handleTabChange('global')}
                  >
                    Global Feed
                  </button>
                </li>
                {selectedTag && (
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'tag' ? 'active' : ''}`}>
                      <i className="ion-pound"></i> {selectedTag}
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList articles={articles} loading={loading} />

            {totalPages > 1 && (
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <TagList tags={tags} onTagSelect={handleTagSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
