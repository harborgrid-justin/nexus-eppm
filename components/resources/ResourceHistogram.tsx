
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { CustomBarChart } from '../charts/CustomBarChart';

const ResourceHistogram: React.FC = () => {
    const data = [
        { month: 'Jan', hours: 1200 }, { month: 'Feb', hours: 1400 },
        { month: 'Mar', hours: 1800 }, { month: 'Apr', hours: 2100 },
        { month: 'May', hours: 1600 }, { month: 'Jun', hours: 1100 },
    ];
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart2 size={20} className="text-nexus-600" /> Resource Histogram (Aggregated Hours)
            </h2>
            <CustomBarChart 
              data={data}
              xAxisKey="month"
              dataKey="hours"
              height={400}
              barColor="#0ea5e9"
            />
        </div>
    );
};

export default ResourceHistogram;
