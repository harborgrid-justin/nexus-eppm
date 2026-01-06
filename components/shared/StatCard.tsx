
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, subtext, icon: Icon, trend }) => {
    return (
        <div className="bg-surface border border-border rounded-lg p-5 md:p-6 flex flex-col h-full group hover:shadow-md hover:border-slate-300">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors truncate">
                {title}
              </p>
              <h3 className="mt-1 font-bold text-xl md:text-2xl text-text-primary font-mono tracking-tighter truncate leading-none">
                {value}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                !trend ? 'bg-slate-50 text-slate-400 group-hover:bg-nexus-50 group-hover:text-nexus-600' :
                trend === 'up' ? 'bg-green-50 text-green-600 group-hover:scale-110' : 
                'bg-red-50 text-red-600 group-hover:scale-110'
            }`}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
          </div>
          {subtext && (
            <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-slate-50 min-w-0">
                {trend && (
                    <span className={`text-[10px] font-bold flex-shrink-0 flex items-center px-1 rounded ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </span>
                )}
                <p className="text-xs text-text-secondary font-semibold truncate leading-tight">{subtext}</p>
            </div>
          )}
        </div>
    );
});

export default StatCard;
