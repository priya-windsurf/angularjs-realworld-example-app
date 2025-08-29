import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { tagsApi } from '../services/tags';
import { ArticleList } from '../components/ArticleList';
import { ListConfig } from '../types';
import { ShowAuthed } from '../components/ShowAuthed';
import { APP_NAME } from '../utils/constants';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [listConfig, setListConfig] = useState<ListConfig>({
    type: user ? 'feed' : 'all',
  });

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsList = await tagsApi.getAll();
        setTags(tagsList);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setTagsLoaded(true);
      }
    };

    loadTags();
  }, []);

  const changeList = (newConfig: ListConfig) => {
    setListConfig({ ...newConfig, currentPage: 1 });
  };

  return (
    <div className="home-page">
      <ShowAuthed when={false}>
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">{APP_NAME.toLowerCase()}</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      </ShowAuthed>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <ShowAuthed when={true}>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${listConfig.type === 'feed' ? 'active' : ''}`}
                      onClick={() => changeList({ type: 'feed' })}
                    >
                      Your Feed
                    </button>
                  </li>
                </ShowAuthed>

                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      listConfig.type === 'all' && !listConfig.filters?.tag ? 'active' : ''
                    }`}
                    onClick={() => changeList({ type: 'all' })}
                  >
                    Global Feed
                  </button>
                </li>

                {listConfig.filters?.tag && (
                  <li className="nav-item">
                    <span className="nav-link active">
                      <i className="ion-pound"></i> {listConfig.filters.tag}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList config={listConfig} limit={10} onConfigChange={setListConfig} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {tags.length > 0 && (
                <div className="tag-list">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className="tag-default tag-pill"
                      onClick={() => changeList({ type: 'all', filters: { tag } })}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {!tagsLoaded && <div>Loading tags...</div>}

              {tagsLoaded && tags.length === 0 && (
                <div className="post-preview">No tags are here... yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
