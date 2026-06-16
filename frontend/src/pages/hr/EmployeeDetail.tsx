import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EmployeeForm from '../../components/employees/EmployeeForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import employeeService from '../../services/employeeService';
import { Employee } from '../../types';
import { ArrowLeft, Edit2, Trash2, Mail, Phone, Building, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [tab, setTab] = useState<'overview' | 'attendance' | 'leaves'>('overview');

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getById(id!);
      setEmployee(data);
    } catch { toast.error('Failed to load employee'); navigate(-1); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployee(); }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      await employeeService.update(id!, data);
      toast.success('Employee updated');
      setShowEdit(false);
      fetchEmployee();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this employee?')) return;
    try { await employeeService.remove(id!); toast.success('Deleted'); navigate(-1); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <DashboardLayout title="Employee"><Loader /></DashboardLayout>;
  if (!employee) return null;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'attendance', label: 'Attendance History' },
    { key: 'leaves', label: 'Leave History' },
  ];

  const infoItems = [
    { icon: Mail, label: 'Email', value: employee.email },
    { icon: Phone, label: 'Phone', value: employee.phone || 'N/A' },
    { icon: Building, label: 'Department', value: employee.department },
    { icon: Briefcase, label: 'Designation', value: employee.designation },
    { icon: DollarSign, label: 'Salary', value: `$${employee.salary?.toLocaleString()}` },
    { icon: Calendar, label: 'Joined', value: format(new Date(employee.joinDate), 'MMM dd, yyyy') },
  ];

  return (
    <DashboardLayout title="Employee Details">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowEdit(true)}><Edit2 className="h-4 w-4 mr-2" /> Edit</Button>
            <Button variant="danger" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
              {employee.avatarUrl ? <img src={employee.avatarUrl} className="h-full w-full object-cover" /> : employee.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-50">{employee.name}</h2>
              <p className="text-slate-400">{employee.designation} • {employee.department}</p>
              <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'danger'} className="mt-2">{employee.status}</Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-800/30 p-1 border border-slate-700/30">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${tab === t.key ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10"><Icon className="h-5 w-5 text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500">{label}</p><p className="text-sm font-medium text-slate-200">{value}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab === 'attendance' && (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-slate-700/50"><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Date</th><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-700/30">
                {(employee.attendance || []).map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-700/20"><td className="px-6 py-3 text-sm text-slate-300">{format(new Date(a.date), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-3"><Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'LATE' ? 'warning' : 'danger'}>{a.status}</Badge></td></tr>
                ))}
                {!(employee.attendance?.length) && <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-500">No attendance records</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'leaves' && (
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-slate-700/50"><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Reason</th><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">From</th><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">To</th><th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-700/30">
                {(employee.leaves || []).map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-700/20"><td className="px-6 py-3 text-sm text-slate-300">{l.reason}</td><td className="px-6 py-3 text-sm text-slate-300">{format(new Date(l.fromDate), 'MMM dd')}</td><td className="px-6 py-3 text-sm text-slate-300">{format(new Date(l.toDate), 'MMM dd')}</td>
                  <td className="px-6 py-3"><Badge variant={l.status === 'APPROVED' ? 'success' : l.status === 'REJECTED' ? 'danger' : 'warning'}>{l.status}</Badge></td></tr>
                ))}
                {!(employee.leaves?.length) && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No leave records</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Employee" size="lg">
          <EmployeeForm employee={employee} onSubmit={handleUpdate} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetail;
