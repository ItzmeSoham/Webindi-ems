import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DepartmentChartProps {
  data: { department: string; count: number }[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Department Distribution</h3>
        <p className="text-slate-400 text-center py-12">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-slate-50 mb-4">Department Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="count"
            nameKey="department"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend
            wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart;
