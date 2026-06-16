import api from './api';
import type { ApiResponse, Employee } from '@/types';

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
}

const employeeService = {
  async getAll(params?: EmployeeFilters): Promise<Employee[]> {
    const { data } = await api.get<ApiResponse<Employee[]>>('/employees', { params });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch employees');
  },

  async getById(id: string): Promise<Employee> {
    const { data } = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch employee');
  },

  async create(employeeData: Partial<Employee>): Promise<Employee> {
    const { data } = await api.post<ApiResponse<Employee>>('/employees', employeeData);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to create employee');
  },

  async update(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const { data } = await api.put<ApiResponse<Employee>>(`/employees/${id}`, employeeData);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to update employee');
  },

  async remove(id: string): Promise<void> {
    const { data } = await api.delete<ApiResponse<void>>(`/employees/${id}`);
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete employee');
    }
  },

  async uploadAvatar(id: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post<ApiResponse<{ avatarUrl: string }>>(`/employees/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (data.success && data.data) {
      return data.data.avatarUrl;
    }
    throw new Error(data.message || 'Failed to upload avatar');
  },
};

export default employeeService;
