import { Request } from 'express';
import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
}

export interface AttendanceFilters {
  date?: string;
  employeeId?: string;
  department?: string;
}

export interface LeaveFilters {
  status?: string;
  employeeId?: string;
}

export interface LogFilters extends PaginationParams {
  userId?: string;
}
