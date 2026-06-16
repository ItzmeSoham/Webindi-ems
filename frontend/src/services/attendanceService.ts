import api from './api';
import type { ApiResponse, Attendance } from '@/types';

export interface AttendanceFilters {
  date?: string;
  department?: string;
  employeeId?: string;
  month?: number;
  year?: number;
}

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

const attendanceService = {
  async getAll(params?: AttendanceFilters): Promise<Attendance[]> {
    const { data } = await api.get<ApiResponse<Attendance[]>>('/attendance', { params });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch attendance');
  },

  async mark(record: AttendanceRecord): Promise<Attendance> {
    const { data } = await api.post<ApiResponse<Attendance>>('/attendance', record);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to mark attendance');
  },

  async bulkMark(records: AttendanceRecord[]): Promise<Attendance[]> {
    const { data } = await api.post<ApiResponse<Attendance[]>>('/attendance/bulk', { records });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to bulk mark attendance');
  },

  async getReport(month: number, year: number): Promise<any> {
    const { data } = await api.get<ApiResponse<any>>('/attendance/report', {
      params: { month, year },
    });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch report');
  },
};

export default attendanceService;
