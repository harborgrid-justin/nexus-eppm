import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, subtext, icon: Icon, trend }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg p-5 md:p-6 flex flex-col h-full group hover:shadow-md hover:border-slate-300 transition-all`}>
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="min-w-0 flex-1">
              <p className={`${theme.typography.label} ${theme.colors.text.secondary} group-hover:${theme.colors.text.primary} transition-colors truncate`}>
                {title}
              </p>
              <h3 className={`mt-1 font-bold text-xl md:text-2xl ${theme.colors.text.primary} font-mono tracking-tighter truncate leading-none`}>
                {value}
              </h3>
            </div>
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                !trend ? `${theme.colors.background} ${theme.colors.text.tertiary} group-hover:bg-nexus-50 group-hover:text-nexus-600` :
                trend === 'up' ? `${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} group-hover:scale-110` : 
                `${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.text} group-hover:scale-110`
            }`}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
          </div>
          {subtext && (
            <div className={`flex items-center gap-1.5 mt-auto pt-3 border-t ${theme.colors.border.replace('border-', 'border-slate-')}50 min-w-0`}>
                {trend && (
                    <span className={`text-[10px] font-bold flex-shrink-0 flex items-center px-1 rounded ${trend === 'up' ? theme.colors.semantic.success.bg : theme.colors.semantic.danger.bg}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </span>
                )}
                <p className={`${theme.typography.body} ${theme.colors.text.secondary} text-xs font-semibold truncate leading-tight`}>{subtext}</p>
            </div>
          )}
        </div>
    );
});

export default StatCard;