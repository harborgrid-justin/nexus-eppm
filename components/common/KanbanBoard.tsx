
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Task, TaskStatus } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { UserAvatar } from './UserAvatar';
import { MoreHorizontal, Plus, Calendar, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => void;
  onTaskClick?: (taskId: string) => void;
  onAddTask?: (status: string) => void;
  readOnly?: boolean;
}

const COLUMNS = [
  { id: 'Not Started', label: 'To Do', color: 'bg-slate-200' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'On Hold', label: 'On Hold', color: 'bg-amber-500' },
  { id: 'Completed', label: 'Done', color: 'bg-green-500' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, onTaskMove, onTaskClick, onAddTask, readOnly 
}) => {
  const theme = useTheme();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns = useMemo(() => {
    const cols: Record<string, Task[]> = {};
    COLUMNS.forEach(c => cols[c.id] = []);
    
    tasks.forEach(task => {
        // Map legacy statuses if needed
        let statusKey = task.status;
        if (!COLUMNS.find(c => c.id === statusKey)) {
             statusKey = 'Not Started'; // Default fallback
        }
        if (cols[statusKey]) cols[statusKey].push(task);
    });
    return cols;
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
      setDraggedTaskId(taskId);
      e.dataTransfer.effectAllowed = 'move';
      // Create ghost image if needed, or rely on browser default
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
      e.preventDefault(); // Necessary to allow dropping
      if (dragOverColumn !== colId) setDragOverColumn(colId);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
      e.preventDefault();
      setDragOverColumn(null);
      if (draggedTaskId && !readOnly) {
          onTaskMove(draggedTaskId, colId);
      }
      setDraggedTaskId(null);
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-max p-4 gap-4">
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className={`w-80 flex flex-col rounded-xl border transition-colors ${
                dragOverColumn === col.id ? 'bg-nexus-50/50 border-nexus-300' : 'bg-slate-50 border-slate-200'
            }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="p-3 flex justify-between items-center border-b border-slate-200/60 sticky top-0 bg-inherit rounded-t-xl z-10">
               <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                   <h3 className="font-bold text-sm text-slate-700">{col.label}</h3>
                   <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                       {columns[col.id]?.length || 0}
                   </span>
               </div>
               {!readOnly && onAddTask && (
                   <button onClick={() => onAddTask(col.id)} className="text-slate-400 hover:text-nexus-600 transition-colors">
                       <Plus size={16}/>
                   </button>
               )}
            </div>

            {/* Cards Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                {columns[col.id]?.map(task => (
                    <div
                        key={task.id}
                        draggable={!readOnly}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onTaskClick?.(task.id)}
                        className={`bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-nexus-300 transition-all group relative ${
                            draggedTaskId === task.id ? 'opacity-40' : 'opacity-100'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 rounded">{task.wbsCode}</span>
                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                                <MoreHorizontal size={14}/>
                            </button>
                        </div>
                        
                        <h4 className="text-sm font-semibold text-slate-800 mb-3 leading-snug">{task.name}</h4>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                {task.critical && <AlertCircle size={14} className="text-red-500" title="Critical Path" />}
                                {task.endDate && (
                                    <span className={`text-[10px] flex items-center gap-1 ${new Date(task.endDate) < new Date() && task.status !== 'Completed' ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                        <Calendar size={10}/> {new Date(task.endDate).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
                                    </span>
                                )}
                            </div>
                            <div className="flex -space-x-1.5">
                                {(task.assignments || []).slice(0, 3).map((assign, i) => (
                                    <UserAvatar key={i} name={assign.resourceId} size="sm" className="w-6 h-6 text-[9px] border border-white" />
                                ))}
                            </div>
                        </div>
                        {task.progress > 0 && task.progress < 100 && (
                            <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-nexus-500" style={{ width: `${task.progress}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
                {columns[col.id]?.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs font-medium italic">
                        Empty
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
