import api from './api';
import type { ApiResponse, DashboardStats } from '@/types';

const analyticsService = {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch dashboard stats');
  },
};

export default analyticsService;
