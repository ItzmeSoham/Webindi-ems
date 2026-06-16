import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/ui/Loader';
import activityLogService from '../../services/activityLogService';
import { ActivityLog } from '../../types';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await activityLogService.getAll({ page, limit: 20 });
      setLogs(res.logs);
      setTotalPages(res.totalPages);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [page]);

  if (loading) return <DashboardLayout title="Logs"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Activity Logs">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <h2 className="text-2xl font-bold text-slate-50">Activity Logs</h2>

        <div className="overflow-x-auto rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
          <table className="w-full">
            <thead><tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Timestamp</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/30">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{log.user?.name || 'System'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-[200px] truncate">{log.details || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                </tr>
              ))}
              {!logs.length && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No activity logs</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Logs;
