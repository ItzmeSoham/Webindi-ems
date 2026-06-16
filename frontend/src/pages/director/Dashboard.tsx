import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import DepartmentChart from '../../components/dashboard/DepartmentChart';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import LeaveChart from '../../components/dashboard/LeaveChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Users, UserCheck, CalendarCheck, Clock, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DirectorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useAnalytics();
  const navigate = useNavigate();

  if (loading) return <DashboardLayout title="Director Dashboard"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Director Dashboard">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-50">Analytics Overview</h2>
            <p className="text-slate-400 mt-1">Welcome, {user?.name}. Here's your company overview.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/director/employees')} size="sm">View Employees</Button>
            <Button variant="secondary" onClick={() => navigate('/director/attendance')} size="sm">Attendance</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Employees" value={stats?.totalEmployees || 0} icon={Users} color="indigo" />
          <StatsCard label="Active Employees" value={stats?.activeEmployees || 0} icon={UserCheck} color="emerald" />
          <StatsCard label="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} icon={CalendarCheck} color="cyan" />
          <StatsCard label="Pending Leaves" value={stats?.pendingLeaves || 0} icon={Clock} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={stats?.departmentDistribution || []} />
          <AttendanceChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaveChart />
          <RecentActivity activities={stats?.recentActivity || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DirectorDashboard;
