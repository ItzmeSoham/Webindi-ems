import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import DepartmentChart from '../../components/dashboard/DepartmentChart';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Users, UserCheck, CalendarCheck, Clock, Plus, ClipboardList, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useAnalytics();
  const navigate = useNavigate();

  if (loading) return <DashboardLayout title="Dashboard"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Welcome back, {user?.name} 👋</h2>
          <p className="text-slate-400 mt-1">Here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Employees" value={stats?.totalEmployees || 0} icon={Users} color="indigo" />
          <StatsCard label="Active Employees" value={stats?.activeEmployees || 0} icon={UserCheck} color="emerald" />
          <StatsCard label="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} icon={CalendarCheck} color="cyan" />
          <StatsCard label="Pending Leaves" value={stats?.pendingLeaves || 0} icon={Clock} color="amber" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/hr/employees')} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Employee
          </Button>
          <Button variant="secondary" onClick={() => navigate('/hr/attendance')} size="sm">
            <ClipboardList className="h-4 w-4 mr-1" /> Mark Attendance
          </Button>
          <Button variant="secondary" onClick={() => navigate('/hr/leaves')} size="sm">
            <FileText className="h-4 w-4 mr-1" /> View Leaves
          </Button>
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={stats?.departmentDistribution || []} />
          <AttendanceChart />
        </div>

        <RecentActivity activities={stats?.recentActivity || []} />
      </div>
    </DashboardLayout>
  );
};

export default HRDashboard;
