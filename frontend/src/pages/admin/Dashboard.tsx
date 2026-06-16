import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import DepartmentChart from '../../components/dashboard/DepartmentChart';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Users, UserCheck, Shield, Activity, UserPlus, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useAnalytics();
  const navigate = useNavigate();

  if (loading) return <DashboardLayout title="SuperAdmin"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="SuperAdmin Dashboard">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">System Overview</h2>
          <p className="text-slate-400 mt-1">Welcome, {user?.name}. Full system control.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Employees" value={stats?.totalEmployees || 0} icon={Users} color="indigo" />
          <StatsCard label="Active Employees" value={stats?.activeEmployees || 0} icon={UserCheck} color="emerald" />
          <StatsCard label="Attendance Rate" value={`${stats?.attendanceRate || 0}%`} icon={Activity} color="cyan" />
          <StatsCard label="Pending Leaves" value={stats?.pendingLeaves || 0} icon={Shield} color="amber" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate('/admin/users')} className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 text-left transition-all hover:border-indigo-500/30 hover:scale-[1.02]">
            <UserPlus className="h-8 w-8 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-slate-50">User Management</h3>
            <p className="text-sm text-slate-400 mt-1">Manage HR & Director accounts</p>
          </button>
          <button onClick={() => navigate('/admin/logs')} className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 text-left transition-all hover:border-purple-500/30 hover:scale-[1.02]">
            <FileText className="h-8 w-8 text-purple-400 mb-3" />
            <h3 className="font-semibold text-slate-50">Activity Logs</h3>
            <p className="text-sm text-slate-400 mt-1">Audit who did what & when</p>
          </button>
          <button onClick={() => navigate('/hr/employees')} className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 text-left transition-all hover:border-cyan-500/30 hover:scale-[1.02]">
            <Users className="h-8 w-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold text-slate-50">Employees</h3>
            <p className="text-sm text-slate-400 mt-1">Full CRUD access</p>
          </button>
          <button onClick={() => navigate('/settings')} className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 text-left transition-all hover:border-emerald-500/30 hover:scale-[1.02]">
            <Settings className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-slate-50">Settings</h3>
            <p className="text-sm text-slate-400 mt-1">System configuration</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={stats?.departmentDistribution || []} />
          <RecentActivity activities={stats?.recentActivity || []} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
