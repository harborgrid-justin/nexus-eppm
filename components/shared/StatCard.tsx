import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon }) => (
    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium text-slate-500">{title}</h4>
        <Icon size={20} className="text-slate-400" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtext}</div>
    </div>
);

export default StatCard;
