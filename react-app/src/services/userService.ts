import api from './api';

export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

export interface UserResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  bio?: string;
  image?: string;
  password?: string;
}

class UserService {
  async login(credentials: LoginCredentials): Promise<UserResponse> {
    const response = await api.post('/users/login', { user: credentials });
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<UserResponse> {
    const response = await api.post('/users', { user: credentials });
    return response.data;
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get('/user');
    return response.data;
  }

  async updateUser(userData: UpdateUserData): Promise<UserResponse> {
    const response = await api.put('/user', { user: userData });
    return response.data;
  }

  setToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new UserService();
