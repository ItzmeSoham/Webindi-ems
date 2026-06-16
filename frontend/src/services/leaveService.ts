import api from './api';
import type { ApiResponse, Leave } from '@/types';

export interface LeaveFilters {
  status?: string;
  employeeId?: string;
}

export interface CreateLeaveData {
  employeeId: string;
  reason: string;
  fromDate: string;
  toDate: string;
}

const leaveService = {
  async getAll(params?: LeaveFilters): Promise<Leave[]> {
    const { data } = await api.get<ApiResponse<Leave[]>>('/leaves', { params });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch leaves');
  },

  async create(leaveData: CreateLeaveData): Promise<Leave> {
    const { data } = await api.post<ApiResponse<Leave>>('/leaves', leaveData);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to create leave request');
  },

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<Leave> {
    const { data } = await api.put<ApiResponse<Leave>>(`/leaves/${id}/status`, { status });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to update leave status');
  },
};

export default leaveService;
