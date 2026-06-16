import React from 'react';
import { Attendance } from '../../types';
import Badge from '../ui/Badge';
import { format } from 'date-fns';
import { ClipboardList } from 'lucide-react';

interface AttendanceTableProps {
  records: Attendance[];
}

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'danger' | 'warning'> = {
    PRESENT: 'success', ABSENT: 'danger', LATE: 'warning',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records }) => {
  if (!records.length) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-12 text-center">
        <ClipboardList className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-400">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Employee</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {records.map((record) => (
            <tr key={record.id} className="transition-colors duration-200 hover:bg-slate-700/20">
              <td className="px-6 py-4 text-sm font-medium text-slate-200">{record.employee?.name || 'Unknown'}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
              <td className="px-6 py-4">{statusBadge(record.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
