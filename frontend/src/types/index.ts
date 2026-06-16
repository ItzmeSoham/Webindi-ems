export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'HR' | 'DIRECTOR';
  isActive: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: Employee;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  createdAt: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employee?: Employee;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fromDate: string;
  toDate: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  details: string;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  attendanceRate: number;
  pendingLeaves: number;
  departmentDistribution: { department: string; count: number }[];
  recentActivity: ActivityLog[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
