import { JWT_KEY } from './constants';

export const saveToken = (token: string): void => {
  localStorage.setItem(JWT_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(JWT_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(JWT_KEY);
};
