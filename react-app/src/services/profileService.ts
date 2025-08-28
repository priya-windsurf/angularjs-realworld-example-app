import api from './api';

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface ProfileResponse {
  profile: Profile;
}

class ProfileService {
  async getProfile(username: string): Promise<ProfileResponse> {
    const response = await api.get(`/profiles/${username}`);
    return response.data;
  }

  async followUser(username: string): Promise<ProfileResponse> {
    const response = await api.post(`/profiles/${username}/follow`);
    return response.data;
  }

  async unfollowUser(username: string): Promise<ProfileResponse> {
    const response = await api.delete(`/profiles/${username}/follow`);
    return response.data;
  }
}

export default new ProfileService();
