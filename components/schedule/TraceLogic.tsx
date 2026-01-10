
import React, { useMemo, useState, useCallback } from 'react';
import { Project, Task, Dependency } from '../../types/index';
import { X, Diamond, ArrowRight, ArrowLeft, GitCommit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TraceLogicProps {
  startTask: Task;
  project: Project;
  onClose: () => void;
}

// Reusable mini-node for the trace view
const TraceNode: React.FC<{ 
    task: Task; 
    relationship?: Dependency | null; 
    type: 'Predecessor' | 'Successor' | 'Focus';
    onNavigate: (task: Task) => void 
}> = React.memo(({ task, relationship, type, onNavigate }) => {
    const theme = useTheme();
    const isFocus = type === 'Focus';
    
    return (
        <div className="flex items-center gap-2 w-full">
            {/* Logic Connector Line (Left) */}
            {type === 'Successor' && (
                <div className="h-px w-8 bg-slate-300 relative flex-shrink-0">
                    <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-300"></div>
                </div>
            )}

            <button 
                onClick={() => onNavigate(task)}
                className={`
                    flex-1 flex flex-col p-3 rounded-xl border transition-all text-left group relative overflow-hidden
                    ${isFocus 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl ring-4 ring-slate-100' 
                        : 'bg-white border-slate-200 hover:border-nexus-400 hover:shadow-md'
                    }
                    ${task.critical && !isFocus ? 'border-l-4 border-l-red-500' : ''}
                `}
            >
                {/* Status Indicator Stripe */}
                {isFocus && <div className="absolute top-0 left-0 w-1.5 h-full bg-nexus-500"></div>}
                
                <div className="flex justify-between items-start mb-1 pl-1">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isFocus ? 'text-slate-400' : 'text-slate-500'}`}>
                        {task.wbsCode}
                    </span>
                    {relationship && (
                        <span className={`text-[9px] px-1.5 rounded font-mono ${isFocus ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {relationship.type} {relationship.lag !== 0 && `+${relationship.lag}d`}
                        </span>
                    )}
                </div>
                
                <p className={`text-sm font-bold truncate w-full ${isFocus ? 'text-white' : 'text-slate-800'}`}>
                    {task.name}
                </p>
                
                <div className={`flex justify-between items-center mt-2 text-[10px] ${isFocus ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>{task.duration}d</span>
                    <span className={task.critical ? 'text-red-500 font-bold' : ''}>
                        TF: {task.totalFloat || 0}
                    </span>
                </div>
            </button>

            {/* Logic Connector Line (Right) */}
            {type === 'Predecessor' && (
                <div className="h-px w-8 bg-slate-300 relative flex-shrink-0">
                     <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-300"></div>
                </div>
            )}
        </div>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className={`bg-slate-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden border border-slate-200`}>
              
              {/* Header */}
              <div className={`p-5 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10`}>
                 <div>
                     <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <GitCommit className="text-nexus-600" size={20}/> Visual Dependency Tracer
                     </h2>
                     <p className="text-xs text-slate-500">Analyze network logic driving activity start dates.</p>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors" aria-label="Close">
                    <X size={20} />
                 </button>
              </div>

              {/* Visualization Area */}
              <div className="flex-1 flex overflow-hidden relative">
                
                {/* Predecessors Column */}
                <div className="flex-1 min-w-[300px] border-r border-slate-200 bg-slate-50/50 flex flex-col">
                    <div className="p-3 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        <ArrowLeft size={12}/> Driving Predecessors
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {predecessors.length > 0 ? predecessors.map((p, idx) => (
                            <TraceNode 
                                key={`${p.task.id}-${idx}`} 
                                task={p.task} 
                                relationship={p.relationship} 
                                type="Predecessor"
                                onNavigate={handleNavigate} 
                            />
                        )) : (
                            <div className="text-center text-slate-400 italic mt-20">Start of Network Chain</div>
                        )}
                    </div>
                </div>

                {/* Focus Task (Center) */}
                <div className="w-[360px] bg-white flex flex-col items-center justify-center p-8 shadow-xl z-10">
                    <TraceNode 
                        task={currentTask} 
                        type="Focus" 
                        onNavigate={() => {}} 
                    />
                    
                    {/* Detail Stats */}
                    <div className="w-full mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Start Date</p>
                            <p className="text-sm font-mono font-bold text-slate-700">{currentTask.startDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Finish Date</p>
                            <p className="text-sm font-mono font-bold text-slate-700">{currentTask.endDate}</p>
                        </div>
                        <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">Progress</span>
                                 <span className="text-xs font-bold text-nexus-700">{currentTask.progress}%</span>
                             </div>
                             <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                 <div className="h-full bg-nexus-600 transition-all duration-500" style={{ width: `${currentTask.progress}%` }}></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Successors Column */}
                 <div className="flex-1 min-w-[300px] border-l border-slate-200 bg-slate-50/50 flex flex-col">
                    <div className="p-3 border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        Successors <ArrowRight size={12}/>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {successors.length > 0 ? successors.map((s, idx) => (
                            <TraceNode 
                                key={`${s.task.id}-${idx}`} 
                                task={s.task} 
                                relationship={s.relationship} 
                                type="Successor"
                                onNavigate={handleNavigate} 
                            />
                        )) : (
                            <div className="text-center text-slate-400 italic mt-20">End of Network Chain</div>
                        )}
                    </div>
                </div>
              </div>

              {/* Navigation Hint */}
              <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
                  Click on any predecessor or successor card to traverse the logic path.
              </div>
           </div>
        </div>
    );
};

export default TraceLogic;
