import React from 'react';
import { ActivityLog } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityLog[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  if (!activities.length) {
    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Activity</h3>
        <p className="text-slate-400 text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-slate-50 mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors duration-200">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200 truncate">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">{activity.user?.name || 'System'}</span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
