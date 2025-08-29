import api from './api';
import { Profile } from '../types';

export const profilesApi = {
  get: async (username: string): Promise<Profile> => {
    const response = await api.get(`/profiles/${username}`);
    return response.data.profile;
  },

  follow: async (username: string): Promise<Profile> => {
    const response = await api.post(`/profiles/${username}/follow`);
    return response.data.profile;
  },

  unfollow: async (username: string): Promise<Profile> => {
    const response = await api.delete(`/profiles/${username}/follow`);
    return response.data.profile;
  },
};
