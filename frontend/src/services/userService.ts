import api from './api';
import type { ApiResponse, User } from '@/types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'HR' | 'DIRECTOR';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'HR' | 'DIRECTOR';
  isActive?: boolean;
}

const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<ApiResponse<User[]>>('/users');
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch users');
  },

  async create(userData: CreateUserData): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/users', userData);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to create user');
  },

  async update(id: string, userData: UpdateUserData): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to update user');
  },

  async remove(id: string): Promise<void> {
    const { data } = await api.delete<ApiResponse<void>>(`/users/${id}`);
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete user');
    }
  },
};

export default userService;
