import api from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

const TOKEN_KEY = 'ems_token';

const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    if (data.success && data.data) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      return data.data;
    }
    throw new Error(data.message || 'Login failed');
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to get user');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { data } = await api.post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    if (!data.success) {
      throw new Error(data.message || 'Failed to change password');
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
