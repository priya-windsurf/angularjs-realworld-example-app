import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { profilesApi } from '../services/profiles';
import { articlesApi } from '../services/articles';
import { Profile, Article, ListConfig } from '../types';
import { ArticleList } from '../components/ArticleList';
import { FollowButton } from '../components/FollowButton';
import { ShowAuthed } from '../components/ShowAuthed';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'favorites'>('articles');

  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const profileData = await profilesApi.get(username);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const getListConfig = (): ListConfig => {
    if (activeTab === 'favorites') {
      return {
        type: 'all',
        filters: { favorited: username },
      };
    }
    return {
      type: 'all',
      filters: { author: username },
    };
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="profile-page">Profile not found</div>;
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

              <ShowAuthed when={true}>
                {isOwner ? (
                  <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-gear-a"></i> Edit Profile Settings
                  </Link>
                ) : (
                  <FollowButton profile={profile} onUpdate={setProfile} />
                )}
              </ShowAuthed>
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

            <ArticleList 
              config={getListConfig()} 
              limit={5} 
              onConfigChange={() => {}} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
