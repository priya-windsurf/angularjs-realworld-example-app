import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { profilesApi } from '../services/profiles';
import { Profile } from '../types';

interface FollowButtonProps {
  profile: Profile;
  onUpdate?: (profile: Profile) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ profile, onUpdate }) => {
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
      const updatedProfile = profile.following
        ? await profilesApi.unfollow(profile.username)
        : await profilesApi.follow(profile.username);
      
      if (onUpdate) {
        onUpdate(updatedProfile);
      }
    } catch (error) {
      console.error('Failed to update follow status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        profile.following ? 'btn-secondary' : 'btn-outline-secondary'
      }`}
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <i className="ion-plus-round"></i>
      {profile.following ? 'Unfollow' : 'Follow'} {profile.username}
    </button>
  );
};
