import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceChartProps {
  data?: { date: string; present: number; absent: number; late: number }[];
}

const defaultData = [
  { date: 'Mon', present: 85, absent: 10, late: 5 },
  { date: 'Tue', present: 88, absent: 8, late: 4 },
  { date: 'Wed', present: 90, absent: 6, late: 4 },
  { date: 'Thu', present: 82, absent: 12, late: 6 },
  { date: 'Fri', present: 78, absent: 15, late: 7 },
];

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const chartData = data || defaultData;

  return (
    <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-slate-50 mb-4">Attendance Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
          <Area type="monotone" dataKey="present" stroke="#6366f1" fillOpacity={1} fill="url(#presentGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="late" stroke="#f59e0b" fillOpacity={1} fill="url(#lateGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
