import React, { useMemo, useState } from 'react';
import { Project, Task, TaskStatus } from '../types';
import { Calendar, ChevronRight, AlertTriangle, CheckCircle2, Circle, Clock } from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

interface ProjectGanttProps {
  project: Project;
}

const ProjectGantt: React.FC<ProjectGanttProps> = ({ project }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Simple date helpers
  const getDaysDiff = (start: string, end: string) => {
    const d1 = new Date(start).getTime();
    const d2 = new Date(end).getTime();
    return Math.round((d2 - d1) / (1000 * 3600 * 24));
  };

  const projectStart = new Date(project.tasks.reduce((min, t) => t.startDate < min ? t.startDate : min, project.tasks[0]?.startDate || new Date().toISOString()));
  const projectEnd = new Date(project.tasks.reduce((max, t) => t.endDate > max ? t.endDate : max, project.tasks[0]?.endDate || new Date().toISOString()));
  
  // Extend timeline buffer
  projectStart.setDate(projectStart.getDate() - 15);
  projectEnd.setDate(projectEnd.getDate() + 45);

  const totalDays = getDaysDiff(projectStart.toISOString(), projectEnd.toISOString());
  
  // Generate timeline headers
  const timelineHeaders = useMemo(() => {
    const headers = [];
    const current = new Date(projectStart);
    while (current <= projectEnd) {
      headers.push(new Date(current));
      current.setDate(current.getDate() + 7); // Weekly steps
    }
    return headers;
  }, [projectStart, projectEnd]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-500 border-green-600';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-600';
      case TaskStatus.DELAYED: return 'bg-red-500 border-red-600';
      default: return 'bg-slate-400 border-slate-500';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.COMPLETED: return <CheckCircle2 size={14} className="text-green-500" />;
        case TaskStatus.IN_PROGRESS: return <Circle size={14} className="text-blue-500 fill-blue-500" />;
        case TaskStatus.DELAYED: return <AlertTriangle size={14} className="text-red-500" />;
        default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  // Dimensions
  const dayWidth = 24; // pixels per day

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">{project.name}</h2>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
            project.health === 'Good' ? 'bg-green-100 text-green-700 border-green-200' :
            project.health === 'Warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
            'bg-red-100 text-red-700 border-red-200'
          }`}>
            {project.health} Health
          </span>
        </div>
        <div className="flex bg-white rounded-md shadow-sm border border-slate-300 p-1">
          <button 
            className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'day' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'week' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'month' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Main Gantt Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Task List (WBS) */}
        <div className="w-[400px] flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-10">
          <div className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 h-[50px] flex items-center px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
            <div className="w-16">ID</div>
            <div className="flex-1">Task Name</div>
            <div className="w-20 text-center">Status</div>
            <div className="w-16 text-right">Dur</div>
          </div>
          {project.tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="group h-[44px] flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm cursor-pointer"
            >
              <div className="w-16 text-slate-500 font-mono text-xs">{task.wbsCode}</div>
              <div className="flex-1 font-medium text-slate-700 truncate pr-2 flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                 {task.critical && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Critical Path"></span>}
                 {task.name}
              </div>
              <div className="w-20 flex justify-center">
                 {getStatusIcon(task.status)}
              </div>
              <div className="w-16 text-right text-slate-500">{task.duration}d</div>
            </div>
          ))}
        </div>

        {/* Right Panel: Timeline */}
        <div className="flex-1 overflow-auto relative bg-white" id="gantt-timeline">
           {/* Timeline Header */}
           <div 
             className="sticky top-0 left-0 z-10 bg-slate-100 border-b border-slate-200 h-[50px] whitespace-nowrap"
             style={{ width: `${totalDays * dayWidth}px` }}
           >
             {timelineHeaders.map((date, i) => (
               <div 
                 key={i} 
                 className="absolute top-0 bottom-0 border-l border-slate-300 px-2 pt-2 text-xs font-semibold text-slate-500"
                 style={{ left: `${getDaysDiff(projectStart.toISOString(), date.toISOString()) * dayWidth}px` }}
               >
                 {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
               </div>
             ))}
           </div>

           {/* Grid Lines */}
           <div 
              className="absolute top-[50px] bottom-0 left-0 right-0 pointer-events-none" 
              style={{ width: `${totalDays * dayWidth}px` }}
           >
              {timelineHeaders.map((date, i) => (
               <div 
                 key={`grid-${i}`} 
                 className="absolute top-0 bottom-0 border-l border-slate-100"
                 style={{ left: `${getDaysDiff(projectStart.toISOString(), date.toISOString()) * dayWidth}px` }}
               />
             ))}
             {/* Today Marker */}
             <div 
                className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                style={{ left: `${getDaysDiff(projectStart.toISOString(), new Date().toISOString()) * dayWidth}px` }}
             >
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
             </div>
           </div>

           {/* Bars */}
           <div className="relative pt-0" style={{ width: `${totalDays * dayWidth}px` }}>
              {project.tasks.map((task, index) => {
                const offsetDays = getDaysDiff(projectStart.toISOString(), task.startDate);
                const widthDays = task.duration;
                
                return (
                  <div 
                    key={`bar-${task.id}`}
                    onClick={() => setSelectedTask(task)}
                    className="h-[44px] flex items-center relative border-b border-slate-50/0 hover:bg-slate-50/50"
                  >
                    <div
                      className={`h-5 rounded-sm border shadow-sm relative group cursor-pointer transition-all hover:h-6 ${getStatusColor(task.status)}`}
                      style={{
                        left: `${offsetDays * dayWidth}px`,
                        width: `${Math.max(widthDays * dayWidth, 2)}px`
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none">
                        {task.startDate} - {task.endDate} ({task.progress}%)
                      </div>
                      
                      {/* Progress Fill */}
                      <div 
                        className="h-full bg-white/30"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          project={project} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
};

export default ProjectGantt;
