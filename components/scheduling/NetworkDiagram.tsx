import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Task, Dependency, TaskStatus } from '../../types/index';
import { 
    Diamond, Loader2, ZoomIn, ZoomOut, Maximize, Move, 
    Calendar, Clock, AlertTriangle, Activity, MousePointer2,
    ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Button } from '../ui/Button';

// --- Types ---
interface NodeTask extends Task {
  children: string[];
  level: number;
  dependencies: Dependency[];
}

interface NodePosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

// --- Constants ---
const NODE_WIDTH = 260;
const NODE_HEIGHT = 120;
const LEVEL_SPACING = 350;
const VERTICAL_SPACING = 140;

// --- Helper Components ---

const ConnectionLine: React.FC<{ 
    start: {x: number, y: number}, 
    end: {x: number, y: number}, 
    isCritical: boolean 
}> = React.memo(({ start, end, isCritical }) => {
    // Calculate control points for smooth bezier curve
    const dist = Math.abs(end.x - start.x);
    const cp1 = { x: start.x + dist * 0.5, y: start.y };
    const cp2 = { x: end.x - dist * 0.5, y: end.y };
    
    const pathData = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

    return (
        <g>
            {/* Outline for visibility on complex backgrounds */}
            <path d={pathData} stroke="white" strokeWidth="4" fill="none" opacity="0.8" />
            {/* Main Line */}
            <path 
                d={pathData} 
                stroke={isCritical ? '#ef4444' : '#94a3b8'} 
                strokeWidth={isCritical ? 2.5 : 1.5} 
                fill="none"
                markerEnd={isCritical ? "url(#arrow-critical)" : "url(#arrow-normal)"}
            />
        </g>
    );
});

const PertNode: React.FC<{ 
    task: NodeTask; 
    x: number; 
    y: number; 
    isSelected: boolean; 
    onSelect: (t: Task) => void;
}> = React.memo(({ task, x, y, isSelected, onSelect }) => {
    const isCritical = task.critical;
    const isMilestone = task.type === 'Milestone';
    const isDone = task.status === TaskStatus.COMPLETED;

    // Status Colors
    let borderColor = 'border-slate-300';
    let headerBg = 'bg-slate-100';
    let headerText = 'text-slate-600';
    let shadow = 'shadow-sm';

    if (isDone) {
        borderColor = 'border-green-500';
        headerBg = 'bg-green-500';
        headerText = 'text-white';
    } else if (isCritical) {
        borderColor = 'border-red-500';
        headerBg = 'bg-red-500';
        headerText = 'text-white';
        shadow = 'shadow-md shadow-red-500/20';
    } else if (task.status === TaskStatus.IN_PROGRESS) {
        borderColor = 'border-blue-500';
        headerBg = 'bg-blue-500';
        headerText = 'text-white';
    }

    if (isSelected) {
        shadow = 'shadow-xl ring-4 ring-nexus-500/20';
    }

    if (isMilestone) {
        return (
            <div 
                onClick={(e) => { e.stopPropagation(); onSelect(task); }}
                className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group z-20`}
                style={{ 
                    left: x, 
                    top: y + (NODE_HEIGHT / 2) - 40, // Center vertically relative to standard nodes
                    width: 120, // Smaller width for milestones
                    height: 80 
                }}
            >
                <div className={`w-12 h-12 rotate-45 border-2 ${borderColor} ${isDone ? 'bg-green-100' : isCritical ? 'bg-red-100' : 'bg-white'} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                    <Diamond size={20} className={isDone ? 'text-green-600' : isCritical ? 'text-red-500' : 'text-slate-500'} strokeWidth={2.5} style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div className="mt-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm whitespace-nowrap max-w-[200px] truncate">
                    {task.name}
                </div>
                <div className="absolute -top-6 text-[9px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-200">
                    {task.endDate}
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onSelect(task); }}
            className={`absolute flex flex-col bg-white rounded-lg border-l-4 ${borderColor} ${shadow} cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg z-10 w-[${NODE_WIDTH}px] h-[${NODE_HEIGHT}px]`}
            style={{ 
                left: x, 
                top: y, 
                width: NODE_WIDTH, 
                height: NODE_HEIGHT 
            }}
        >
            {/* Header */}
            <div className={`flex justify-between items-center px-3 py-1.5 border-b border-slate-100 ${headerBg} bg-opacity-10`}>
                <span className={`text-[10px] font-black uppercase tracking-wider font-mono ${isCritical || isDone ? 'text-slate-700' : 'text-slate-500'}`}>
                    {task.wbsCode}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${isDone ? 'bg-green-500' : isCritical ? 'bg-red-500' : 'bg-slate-400'}`}>
                    {task.status === 'In Progress' ? `${Math.round(task.progress)}%` : task.status === 'Completed' ? 'DONE' : isCritical ? 'CRITICAL' : 'PLANNED'}
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 p-3 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 mb-2" title={task.name}>
                    {task.name}
                </h4>
                <div className="flex justify-between items-end mt-auto text-xs text-slate-500">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Clock size={12} className="text-slate-400"/>
                            <span className="font-mono">{task.duration}d</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Activity size={12} className={task.totalFloat === 0 ? 'text-red-400' : 'text-green-400'}/>
                            <span className="font-mono">TF: {task.totalFloat}d</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold mb-0.5">Finish</div>
                        <span className="font-mono font-bold text-slate-700">{task.endDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});


const NetworkDiagram: React.FC = () => {
    const { project } = useProjectWorkspace();
    const theme = useTheme();
    
    // Canvas State
    const [transform, setTransform] = useState({ x: 50, y: 50, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // --- Layout Calculation ---
    const { nodes, levels, layoutHeight, layoutWidth } = useMemo(() => {
        if (!project) return { nodes: [], levels: [], layoutHeight: 0, layoutWidth: 0 };
        
        const tasks = project.tasks || [];
        const taskMap = new Map(tasks.map(t => [t.id, t]));
        
        // Calculate Levels (Longest path to start)
        const levelsMap = new Map<string, number>();
        const getLevel = (taskId: string, visited = new Set<string>()): number => {
            if (visited.has(taskId)) return 0; // Cycle protection
            if (levelsMap.has(taskId)) return levelsMap.get(taskId)!;
            
            visited.add(taskId);
            const task = taskMap.get(taskId);
            if (!task) return 0;

            const predecessors = tasks.filter(t => t.dependencies.some(d => d.targetId === taskId));
            if (predecessors.length === 0) {
                levelsMap.set(taskId, 0);
                return 0;
            }

            const maxPredLevel = Math.max(...predecessors.map(p => getLevel(p.id, new Set(visited))));
            const level = maxPredLevel + 1;
            levelsMap.set(taskId, level);
            return level;
        };

        tasks.forEach(t => getLevel(t.id));

        // Group by Level
        const levelGroups: NodeTask[][] = [];
        tasks.forEach(t => {
            const lvl = levelsMap.get(t.id) || 0;
            if (!levelGroups[lvl]) levelGroups[lvl] = [];
            levelGroups[lvl].push({ ...t, children: [], level: lvl });
        });

        // Calculate X,Y coordinates
        // Simple algorithm: Center verticals based on max items in a level
        const maxItemsInLevel = Math.max(...levelGroups.map(l => l.length));
        const totalHeight = maxItemsInLevel * VERTICAL_SPACING;
        const totalWidth = levelGroups.length * LEVEL_SPACING;

        const calculatedNodes = levelGroups.flatMap((group, lvlIdx) => {
            return group.map((node, itemIdx) => {
                // Center the group vertically in the canvas space
                const groupHeight = group.length * VERTICAL_SPACING;
                const startY = (totalHeight - groupHeight) / 2;
                
                return {
                    ...node,
                    x: lvlIdx * LEVEL_SPACING,
                    y: startY + (itemIdx * VERTICAL_SPACING),
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT
                };
            });
        });

        return { 
            nodes: calculatedNodes, 
            levels: levelGroups, 
            layoutHeight: totalHeight, 
            layoutWidth: totalWidth 
        };
    }, [project?.tasks]);

    // --- Interactive Handlers ---

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const scaleFactor = 0.1;
            const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
            const newScale = Math.min(Math.max(0.2, transform.scale + delta), 2);
            setTransform(p => ({ ...p, scale: newScale }));
        } else {
            setTransform(p => ({ ...p, x: p.x - e.deltaX, y: p.y - e.deltaY }));
        }
    }, [transform.scale]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if clicking background
        if ((e.target as HTMLElement).closest('.pert-node')) return;
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsDragging(false);

    const fitToScreen = () => {
        if (!containerRef.current || layoutWidth === 0) return;
        const container = containerRef.current.getBoundingClientRect();
        const scaleX = (container.width - 100) / layoutWidth;
        const scaleY = (container.height - 100) / layoutHeight;
        const scale = Math.min(Math.min(scaleX, scaleY), 1); // Don't zoom in past 1
        
        // Center it
        const x = (container.width - (layoutWidth * scale)) / 2;
        const y = (container.height - (layoutHeight * scale)) / 2;

        setTransform({ x, y, scale });
    };

    useEffect(() => {
        if (nodes.length > 0) fitToScreen();
    }, [nodes.length]); // Auto fit on load

    if (!project) return null;

    return (
        <div className={`h-full w-full flex flex-col ${theme.colors.background} overflow-hidden relative select-none`}>
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                 <div className="flex bg-white rounded-lg shadow-lg border border-slate-200 p-1">
                    <button onClick={() => setTransform(p => ({...p, scale: p.scale + 0.1}))} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom In">
                        <ZoomIn size={18}/>
                    </button>
                    <button onClick={() => setTransform(p => ({...p, scale: Math.max(0.2, p.scale - 0.1)}))} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Zoom Out">
                        <ZoomOut size={18}/>
                    </button>
                    <div className="w-px bg-slate-200 mx-1 my-2"></div>
                    <button onClick={fitToScreen} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Fit to Screen">
                        <Maximize size={18}/>
                    </button>
                 </div>
                 
                 <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-48">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">Legend</h4>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div> Critical Path
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div> Standard Task
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div> Completed
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-2.5 h-2.5 border-2 border-slate-400 rotate-45 transform scale-75"></div> Milestone
                        </div>
                    </div>
                 </div>
            </div>

            {/* Canvas */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative bg-slate-50"
                style={{ 
                    backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', 
                    backgroundSize: '24px 24px',
                    backgroundPosition: `${transform.x}px ${transform.y}px`
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <div 
                    style={{ 
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        transformOrigin: '0 0',
                        width: layoutWidth + 500, // Buffer
                        height: layoutHeight + 500
                    }}
                    className="absolute top-0 left-0 transition-transform duration-75 ease-linear"
                >
                    {/* Define Arrows */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                            </marker>
                            <marker id="arrow-critical" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                            </marker>
                        </defs>
                        {/* Render Edges */}
                        {nodes.map(node => (
                            (node.dependencies || []).map(dep => {
                                const target = nodes.find(n => n.id === dep.targetId);
                                if (!target) return null;
                                
                                const isCritical = node.critical && target.critical;
                                
                                return (
                                    <ConnectionLine 
                                        key={`${node.id}-${target.id}`}
                                        start={{ x: target.x + (target.type === 'Milestone' ? 60 : NODE_WIDTH), y: target.y + (target.type === 'Milestone' ? 0 : NODE_HEIGHT/2) }}
                                        end={{ x: node.x, y: node.y + (node.type === 'Milestone' ? 0 : NODE_HEIGHT/2) }}
                                        isCritical={isCritical}
                                    />
                                );
                            })
                        ))}
                    </svg>

                    {/* Render Nodes */}
                    {nodes.map(node => (
                        <PertNode 
                            key={node.id} 
                            task={node} 
                            x={node.x} 
                            y={node.y} 
                            isSelected={selectedTask?.id === node.id}
                            onSelect={setSelectedTask}
                        />
                    ))}
                </div>
            </div>

            {/* Node Detail Panel (Bottom Slide-in) */}
            {selectedTask && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 animate-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-start mb-4">
                         <div>
                             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                 {selectedTask.type === 'Milestone' && <Diamond size={16} className="text-nexus-600"/>}
                                 {selectedTask.name}
                             </h3>
                             <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                 <span className="font-mono bg-slate-100 px-1.5 rounded">{selectedTask.id}</span>
                                 <span className="flex items-center gap-1"><Calendar size={12}/> {selectedTask.startDate} → {selectedTask.endDate}</span>
                                 <span className="flex items-center gap-1"><Clock size={12}/> {selectedTask.duration}d</span>
                             </div>
                         </div>
                         <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><ZoomOut size={16} /></button>
                     </div>
                     <div className="grid grid-cols-4 gap-4 border-t border-slate-100 pt-4">
                         <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400">Total Float</p>
                             <p className={`font-mono text-lg font-bold ${selectedTask.critical ? 'text-red-500' : 'text-green-500'}`}>{selectedTask.totalFloat}d</p>
                         </div>
                         <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400">Progress</p>
                             <p className="font-mono text-lg font-bold text-slate-700">{selectedTask.progress}%</p>
                         </div>
                         <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400">Predecessors</p>
                             <p className="font-mono text-lg font-bold text-slate-700">{selectedTask.dependencies.length}</p>
                         </div>
                          <div className="flex items-center justify-end">
                             <Button size="sm" variant="secondary" onClick={() => console.log('Edit task')}>Edit Activity</Button>
                         </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default NetworkDiagram;