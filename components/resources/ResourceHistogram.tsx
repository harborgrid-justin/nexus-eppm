
import React, { useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useData } from '../../context/DataContext';

const ResourceHistogram: React.FC = () => {
    const { state } = useData();

    // Dynamically calculate histogram from all projects/tasks/assignments
    const data = useMemo(() => {
        const monthMap: Record<string, number> = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Initialize map
        months.forEach(m => monthMap[m] = 0);

        state.projects.forEach(project => {
            project.tasks.forEach(task => {
                if (task.assignments && task.assignments.length > 0) {
                    const start = new Date(task.startDate);
                    const end = new Date(task.endDate);
                    const durationDays = task.duration || 1;
                    
                    // Simple distribution logic: spread hours across months intersected
                    task.assignments.forEach(assignment => {
                         // Total hours for this assignment
                         // Assuming 8h day for simplicity in this aggregate view
                         const totalHours = (assignment.units / 100) * 8 * durationDays;
                         
                         let current = new Date(start);
                         while (current <= end) {
                             const mIndex = current.getMonth();
                             const mName = months[mIndex];
                             // Add daily chunk (approx)
                             if (monthMap[mName] !== undefined) {
                                 monthMap[mName] += (totalHours / durationDays);
                             }
                             current.setDate(current.getDate() + 1);
                         }
                    });
                }
            });
        });

        return Object.entries(monthMap).map(([month, hours]) => ({
            month,
            hours: Math.round(hours)
        }));
    }, [state.projects]);

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
