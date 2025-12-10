import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${
            !trend ? 'bg-blue-50 text-blue-600' :
            trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
);

export default StatCard;