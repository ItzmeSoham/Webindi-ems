import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LeaveChartProps {
  data?: { month: string; approved: number; rejected: number; pending: number }[];
}

const defaultData = [
  { month: 'Jan', approved: 8, rejected: 2, pending: 1 },
  { month: 'Feb', approved: 6, rejected: 3, pending: 2 },
  { month: 'Mar', approved: 10, rejected: 1, pending: 3 },
  { month: 'Apr', approved: 5, rejected: 4, pending: 0 },
  { month: 'May', approved: 9, rejected: 2, pending: 2 },
  { month: 'Jun', approved: 7, rejected: 1, pending: 4 },
];

const LeaveChart: React.FC<LeaveChartProps> = ({ data }) => {
  const chartData = data || defaultData;

  return (
    <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-slate-50 mb-4">Leave Statistics</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
          <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveChart;
