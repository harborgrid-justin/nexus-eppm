
import React, { useMemo, useState, useCallback } from 'react';
import { Project, Task, Dependency } from '../../types/index';
import { X, Diamond, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TraceLogicProps {
  startTask: Task;
  project: Project;
  onClose: () => void;
}

const NodeCard: React.FC<{ task: Task; relationship?: Dependency | null; onNavigate: (task: Task) => void }> = React.memo(({ task, relationship, onNavigate }) => {
    const theme = useTheme();
    return (
        <button 
            onClick={() => onNavigate(task)}
            className={`w-full p-3 rounded-lg text-left transition-all hover:shadow-lg hover:border-nexus-400
                ${task.critical ? 'border-2 border-red-300 bg-red-50' : `border ${theme.colors.border} bg-white`}
            `}
        >
            <p className="font-bold text-sm text-slate-800">{task.name}</p>
            <p className="text-xs text-slate-500 font-mono">{task.wbsCode}</p>
            {relationship && (
                <div className="mt-2 pt-2 border-t border-dashed text-xs text-slate-500">
                    {relationship.type} {relationship.lag > 0 ? `+${relationship.lag}d` : ''}
                </div>
            )}
        </button>
    );
});


const TraceLogic: React.FC<TraceLogicProps> = ({ startTask, project, onClose }) => {
    const [currentTask, setCurrentTask] = useState(startTask);
    const theme = useTheme();

    const { predecessors, successors } = useMemo(() => {
        const taskMap = new Map(project.tasks.map(t => [t.id, t]));
        
        const preds = currentTask.dependencies.map(dep => {
            const task = taskMap.get(dep.targetId);
            return task ? { task, relationship: dep } : null;
        }).filter((p): p is { task: Task, relationship: Dependency } => p !== null);

        const succs = project.tasks.filter(
            t => t.dependencies.some(d => d.targetId === currentTask.id)
        ).map(task => {
            const relationship = task.dependencies.find(d => d.targetId === currentTask.id);
            return { task, relationship };
        });

        return { predecessors: preds, successors: succs };
    }, [currentTask, project.tasks]);

    const handleNavigate = useCallback((task: Task) => {
        setCurrentTask(task);
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className={`bg-slate-100 rounded-2xl shadow-2xl w-full max-w-5xl h-[70vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border ${theme.colors.border}`}>
              
              <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.surface}`}>
                 <h2 className={theme.typography.h2}>Trace Logic: <span className="text-nexus-600">{currentTask.name}</span></h2>
                 <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full" aria-label="Close Trace Logic">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
                {/* Predecessors */}
                <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-slate-500 text-center sticky top-0 bg-slate-100 py-1">{theme.typography.label}>Predecessors</h3>
                    {predecessors.map(p => <NodeCard key={p.task.id} task={p.task} relationship={p.relationship} onNavigate={handleNavigate} />)}
                </div>

                {/* Current Task */}
                <div className="flex items-center justify-center">
                    <div className={`p-4 rounded-lg shadow-xl border-2 border-nexus-500 ${theme.colors.surface} w-64 text-center`}>
                       <p className="font-bold text-slate-900">{currentTask.name}</p>
                       <p className={`text-sm ${theme.colors.text.secondary} font-mono mt-1`}>{currentTask.wbsCode}</p>
                       <div className="text-xs mt-3 space-y-1">
                           <p>Start: {currentTask.startDate}</p>
                           <p>Finish: {currentTask.endDate}</p>
                           <p>Duration: {currentTask.duration}d</p>
                       </div>
                    </div>
                </div>

                {/* Successors */}
                 <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                    <h3 className="font-semibold text-slate-500 text-center sticky top-0 bg-slate-100 py-1">{theme.typography.label}>Successors</h3>
                    {successors.map(s => <NodeCard key={s.task.id} task={s.task} relationship={s.relationship} onNavigate={handleNavigate} />)}
                </div>
              </div>

           </div>
        </div>
    );
};

export default TraceLogic;
