import React, { useMemo } from 'react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { getDaysDiff } from '../../utils/dateUtils';
import { Users } from 'lucide-react';

interface ResourceUsageViewProps {
  project: Project;
  dayWidth: number;
  projectStartDate: Date;
}

const ResourceUsageView: React.FC<ResourceUsageViewProps> = ({ project, dayWidth, projectStartDate }) => {
  const { state } = useData();

  const resourceAllocations = useMemo(() => {
    const allocations: Record<string, number[]> = {};
    const totalDays = getDaysDiff(projectStartDate, new Date(project.endDate));

    // FIX: Property 'assignedResources' does not exist on type 'Task'. Use 'assignments'.
    const projectResources = state.resources.filter(r => 
        project.tasks.some(t => t.assignments.some(a => a.resourceId === r.id))
    );

    projectResources.forEach(res => {
      allocations[res.id] = new Array(totalDays + 1).fill(0);
    });

    project.tasks.forEach(task => {
      const startDay = getDaysDiff(projectStartDate, new Date(task.startDate));
      const endDay = getDaysDiff(projectStartDate, new Date(task.endDate));

      for (let i = startDay; i <= endDay; i++) {
        // FIX: Property 'assignedResources' does not exist on type 'Task'. Use 'assignments'.
        task.assignments.forEach(assignment => {
          if (allocations[assignment.resourceId]) {
            // Assuming 8 hours/day for simplicity
            allocations[assignment.resourceId][i] += 8 / task.assignments.length; 
          }
        });
      }
    });

    return { allocations, projectResources };
  }, [project.tasks, project.endDate, projectStartDate, state.resources]);

  return (
    <div className="flex-shrink-0 border-t-2 border-slate-300 bg-slate-50/50">
      <div className="flex h-full">
        <div className="w-[450px] flex-shrink-0 border-r border-slate-200">
           <div className="h-[32px] flex items-center px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider bg-slate-100 border-b border-slate-200">
             Resource
           </div>
           {resourceAllocations.projectResources.map(res => (
             <div key={res.id} className="h-[44px] flex items-center px-4 border-b border-slate-100 text-sm font-medium text-slate-700">
               {res.name}
             </div>
           ))}
        </div>
        <div className="flex-1 overflow-x-hidden relative">
          <div className="h-[32px] bg-slate-100 border-b border-slate-200" />
           <div style={{ width: `${getDaysDiff(projectStartDate, new Date(project.endDate)) * dayWidth}px`}}>
             {resourceAllocations.projectResources.map(res => {
               const dailyAlloc = resourceAllocations.allocations[res.id];
               return (
                 <div key={`usage-${res.id}`} className="h-[44px] flex border-b border-slate-100 relative">
                   {dailyAlloc.map((hours, dayIndex) => {
                     if (hours === 0) return null;
                     const allocationPercent = (hours / 8) * 100; // Assuming 8hr day
                     let bgColor = 'bg-green-500/50';
                     if (allocationPercent > 100) bgColor = 'bg-red-500/70';
                     else if (allocationPercent > 80) bgColor = 'bg-yellow-500/60';

                     return (
                       <div 
                         key={dayIndex} 
                         className={`absolute bottom-0 ${bgColor}`}
                         style={{
                           left: `${dayIndex * dayWidth}px`,
                           width: `${dayWidth}px`,
                           height: `${Math.min(allocationPercent, 100)}%`
                         }}
                         title={`${res.name} on day ${dayIndex+1}: ${allocationPercent.toFixed(0)}% allocated`}
                       />
                     );
                   })}
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageView;