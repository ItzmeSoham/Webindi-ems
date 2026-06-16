import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import StatsCard from '../../components/dashboard/StatsCard';
import { useAnalytics } from '../../hooks/useAnalytics';
import reportService from '../../services/reportService';
import { FileSpreadsheet, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1), label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
}));

const Reports: React.FC = () => {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [empLoading, setEmpLoading] = useState(false);
  const [attLoading, setAttLoading] = useState(false);
  const { stats } = useAnalytics();

  const exportEmployees = async () => {
    setEmpLoading(true);
    try { await reportService.exportEmployeesCSV(); toast.success('Employees CSV downloaded'); }
    catch { toast.error('Export failed'); }
    finally { setEmpLoading(false); }
  };

  const exportAttendance = async () => {
    setAttLoading(true);
    try { await reportService.exportAttendanceCSV(Number(month), Number(year)); toast.success('Attendance CSV downloaded'); }
    catch { toast.error('Export failed'); }
    finally { setAttLoading(false); }
  };

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: String(y), label: String(y) };
  });

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <h2 className="text-2xl font-bold text-slate-50">Reports</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard label="Total Employees" value={stats?.totalEmployees || 0} icon={Users} color="indigo" />
          <StatsCard label="Active Employees" value={stats?.activeEmployees || 0} icon={Calendar} color="emerald" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Export */}
          <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-50">Employee Report</h3>
                <p className="text-sm text-slate-400">Export all employee data as CSV</p>
              </div>
            </div>
            <Button onClick={exportEmployees} loading={empLoading} fullWidth>Download Employees CSV</Button>
          </div>

          {/* Attendance Export */}
          <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-50">Attendance Report</h3>
                <p className="text-sm text-slate-400">Export monthly attendance data</p>
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              <Select options={months} value={month} onChange={(e) => setMonth(e.target.value)} />
              <Select options={years} value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <Button onClick={exportAttendance} loading={attLoading} fullWidth variant="secondary">Download Attendance CSV</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
