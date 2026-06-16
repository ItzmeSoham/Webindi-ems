import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { Lock, User, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.currentPassword) errs.currentPassword = 'Required';
    if (form.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <h2 className="text-2xl font-bold text-slate-50">Settings</h2>

        {/* Profile Info */}
        <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/20">
              <User className="h-5 w-5 text-indigo-400" />
              <div><p className="text-xs text-slate-500">Name</p><p className="text-sm text-slate-200">{user?.name}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/20">
              <Mail className="h-5 w-5 text-indigo-400" />
              <div><p className="text-xs text-slate-500">Email</p><p className="text-sm text-slate-200">{user?.email}</p></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/20">
              <Shield className="h-5 w-5 text-indigo-400" />
              <div><p className="text-xs text-slate-500">Role</p><Badge variant="info">{user?.role}</Badge></div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Change Password</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Current Password" type="password" value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} error={errors.currentPassword}
              icon={<Lock className="h-4 w-4" />} required />
            <Input label="New Password" type="password" value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })} error={errors.newPassword}
              icon={<Lock className="h-4 w-4" />} required />
            <Input label="Confirm Password" type="password" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword}
              icon={<Lock className="h-4 w-4" />} required />
            <div className="flex justify-end"><Button type="submit" loading={loading}>Update Password</Button></div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
