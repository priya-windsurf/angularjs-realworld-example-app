import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import profileService, { Profile } from '../services/profileService';
import articlesService, { Article } from '../services/articlesService';
import ArticleList from '../components/ArticleList';

interface ProfilePageProps {
  tab?: 'favorites';
}

const ProfilePage: React.FC<ProfilePageProps> = ({ tab }) => {
  const { username } = useParams<{ username: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'favorites'>(tab || 'articles');

  const articlesPerPage = 5;
  const isOwnProfile = user?.username === username;

  useEffect(() => {
    if (username) {
      loadProfile();
      loadArticles();
    }
  }, [username, activeTab, currentPage]);

  const loadProfile = async () => {
    if (!username) return;
    
    try {
      const response = await profileService.getProfile(username);
      setProfile(response.profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadArticles = async () => {
    if (!username) return;
    
    setLoading(true);
    try {
      const offset = (currentPage - 1) * articlesPerPage;
      const filters = {
        limit: articlesPerPage,
        offset,
        ...(activeTab === 'favorites' 
          ? { favorited: username }
          : { author: username }
        ),
      };
      
      const response = await articlesService.getArticles(filters);
      setArticles(response.articles);
      setArticlesCount(response.articlesCount);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!username || !profile) return;
    
    try {
      if (profile.following) {
        const response = await profileService.unfollowUser(username);
        setProfile(response.profile);
      } else {
        const response = await profileService.followUser(username);
        setProfile(response.profile);
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  const totalPages = Math.ceil(articlesCount / articlesPerPage);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} className="user-img" alt="" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a"></i>
                  &nbsp; Edit Profile Settings
                </Link>
              ) : (
                <button
                  className={`btn btn-sm action-btn ${
                    profile.following ? 'btn-secondary' : 'btn-outline-secondary'
                  }`}
                  onClick={handleFollow}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                  >
                    My Articles
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    Favorited Articles
                  </button>
                </li>
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
