
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-nexus-200 group">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide group-hover:text-nexus-600 transition-colors">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 md:mt-2 font-mono tracking-tight">{value}</h3>
        </div>
        <div className={`p-2 md:p-3 rounded-xl transition-colors ${
            !trend ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' :
            trend === 'up' ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-red-50 text-red-600 group-hover:bg-red-100'
        }`}>
          <Icon size={20} className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
      {subtext && (
        <div className="flex items-center gap-2">
            {trend && (
                <span className={`text-[10px] md:text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? '↑' : '↓'}
                </span>
            )}
            <p className="text-xs text-slate-400 font-medium truncate">{subtext}</p>
        </div>
      )}
    </div>
));

export default StatCard;
