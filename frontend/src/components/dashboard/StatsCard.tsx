import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

const colorMap = {
  indigo: 'from-indigo-500 to-purple-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
  cyan: 'from-cyan-500 to-blue-500',
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, color = 'indigo' }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{value}</p>
          {trend !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${colorMap[color]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
    </div>
  );
};

export default StatsCard;
