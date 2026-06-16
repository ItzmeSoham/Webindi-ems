import React from 'react';
import { Leave } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { format, differenceInDays } from 'date-fns';
import { FileText, Check, X } from 'lucide-react';

interface LeaveTableProps {
  leaves: Leave[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  loading?: boolean;
}

const statusBadge = (status: string) => {
  const map: Record<string, 'warning' | 'success' | 'danger'> = {
    PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
};

const LeaveTable: React.FC<LeaveTableProps> = ({ leaves, onApprove, onReject, loading }) => {
  if (!leaves.length) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-400">No leave requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Employee</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Reason</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">From</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">To</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Days</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {leaves.map((leave) => (
            <tr key={leave.id} className="transition-colors duration-200 hover:bg-slate-700/20">
              <td className="px-6 py-4 text-sm font-medium text-slate-200">{leave.employee?.name || 'Unknown'}</td>
              <td className="px-6 py-4 text-sm text-slate-300 max-w-[200px] truncate">{leave.reason}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{format(new Date(leave.fromDate), 'MMM dd, yyyy')}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{format(new Date(leave.toDate), 'MMM dd, yyyy')}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{differenceInDays(new Date(leave.toDate), new Date(leave.fromDate)) + 1}</td>
              <td className="px-6 py-4">{statusBadge(leave.status)}</td>
              <td className="px-6 py-4 text-right">
                {leave.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2">
                    {onApprove && (
                      <Button variant="secondary" size="sm" onClick={() => onApprove(leave.id)} disabled={loading}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    )}
                    {onReject && (
                      <Button variant="danger" size="sm" onClick={() => onReject(leave.id)} disabled={loading}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
