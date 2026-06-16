import api from './api';
import type { ApiResponse, ActivityLog } from '@/types';

export interface LogFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export interface PaginatedLogs {
  logs: ActivityLog[];
  total: number;
  page: number;
  totalPages: number;
}

const activityLogService = {
  async getAll(params?: LogFilters): Promise<PaginatedLogs> {
    const { data } = await api.get<ApiResponse<PaginatedLogs>>('/activity-logs', { params });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch activity logs');
  },
};

export default activityLogService;
