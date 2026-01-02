
import React, { useMemo, Suspense, useTransition } from 'react';
import { Project, Task, Dependency } from '../../types/index';
import { Diamond, Loader2, Share2, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
// FIX: Added missing imports for Button and Badge.
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface NodeTask extends Task {
  children: string[];
  level: number;
  dependencies: Dependency[];
}

const NetworkPaths: React.FC<{ nodes: NodeTask[], positions: Map<string, any>, tasks: Task[] }> = ({ nodes, positions, tasks }) => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
                <marker id="arrow-critical" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" /></marker>
            </defs>
            {nodes.map(node => 
                node.dependencies.map(dep => {
                    const startPos = positions.get(dep.targetId);
                    const endPos = positions.get(node.id);
                    if (!startPos || !endPos) return null;
                    const isCritical = node.critical && tasks.find(t=>t.id === dep.targetId)?.critical;
                    return (
                        <path 
                            key={`${node.id}-${dep.targetId}`} 
                            d={`M ${startPos.x + startPos.width} ${startPos.y + startPos.height / 2} C ${startPos.x + startPos.width + 50} ${startPos.y + startPos.height / 2}, ${endPos.x - 50} ${endPos.y + endPos.height / 2}, ${endPos.x} ${endPos.y + endPos.height / 2}`} 
                            stroke={isCritical ? '#ef4444' : '#cbd5e1'} 
                            strokeWidth={isCritical ? "3" : "1.5"} 
                            fill="none" 
                            markerEnd={`url(#arrow${isCritical ? '-critical': ''})`}
                        />
                    );
                })
            )}
        </svg>
    );
};

const NetworkDiagram: React.FC = () => {
  const { project } = useProjectWorkspace();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const { nodes, levels } = useMemo(() => {
    const tasks = project.tasks;
    const nodes: NodeTask[] = tasks.map(t => ({ ...t, children: [] as string[], level: -1 }));
    const nodeMap = new Map<string, NodeTask>(nodes.map(n => [n.id, n]));
    tasks.forEach(task => task.dependencies.forEach(dep => nodeMap.get(dep.targetId)?.children.push(task.id)));
    const assignLevel = (id: string, level: number) => {
      const n = nodeMap.get(id);
      if (n && n.level < level) { n.level = level; n.children.forEach(c => assignLevel(c, level + 1)); }
    };
    nodes.forEach(n => { if (n.dependencies.length === 0) assignLevel(n.id, 0); });
    const levelsArr = nodes.reduce((acc, n) => { if (n.level === -1) n.level = 0; if (!acc[n.level]) acc[n.level] = []; acc[n.level].push(n); return acc; }, [] as NodeTask[][]);
    return { nodes, levels: levelsArr };
  }, [project.tasks]);
  
  const nodePositions = useMemo(() => {
    const pos = new Map<string, { x: number, y: number, width: number, height: number }>();
    levels.forEach((lTasks, lIdx) => {
      lTasks.forEach((t, tIdx) => pos.set(t.id, { x: lIdx * 280 + 80, y: tIdx * 140 + 80, width: 220, height: 100 }));
    });
    return pos;
  }, [levels]);

  if (!project) return null;

  return (
    <div className={`h-full w-full flex flex-col ${theme.colors.background} overflow-hidden`}>
      <div className="p-4 border-b bg-white flex justify-between items-center z-20 shadow-sm">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-nexus-50 text-nexus-600 rounded-lg shadow-sm"><Share2 size={24}/></div>
              <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">CPM Network Explorer</h2>
                  <p className="text-xs text-slate-500 font-medium">Visual dependency tracing across {nodes.length} activities.</p>
              </div>
          </div>
          <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border">
                  <button className="p-1.5 hover:bg-white rounded shadow-sm text-slate-500"><ZoomIn size={16}/></button>
                  <button className="p-1.5 hover:bg-white rounded shadow-sm text-slate-500"><ZoomOut size={16}/></button>
              </div>
              <Button variant="secondary" icon={Maximize2} size="sm">Auto-Fit</Button>
          </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100/30 p-10 scrollbar-thin">
        <div className="relative" style={{ width: levels.length * 280 + 300, height: Math.max(...levels.map(l => l.length)) * 140 + 300 }}>
            {/* Pattern 26: Suspense for heavy path calculation */}
            <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"><Loader2 className="animate-spin text-slate-300" size={64}/></div>}>
                <NetworkPaths nodes={nodes} positions={nodePositions} tasks={project.tasks} />
            </Suspense>

            {nodes.map(node => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;
              return (
                <div key={node.id} className={`absolute p-4 rounded-xl shadow-lg border-2 transition-all hover:scale-105 hover:shadow-2xl z-10 cursor-pointer ${node.critical ? 'border-red-500 bg-white ring-4 ring-red-500/10' : 'border-slate-200 bg-white hover:border-nexus-400'}`} style={{ left: pos.x, top: pos.y, width: pos.width, height: pos.height }}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{node.wbsCode}</span>
                        {node.critical && <Badge variant="danger" className="scale-75 origin-top-right">Critical</Badge>}
                    </div>
                    <div className="font-black text-slate-800 text-sm truncate mb-3 leading-tight">{node.name}</div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-2 mt-auto">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration<div className="text-xs text-slate-900 font-mono">{node.duration}d</div></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Progress<div className="text-xs text-nexus-600 font-mono">{node.progress}%</div></div>
                    </div>
                    {node.type === 'Milestone' && <div className="absolute -bottom-2 -right-2 p-1.5 bg-nexus-600 rounded-lg text-white shadow-lg rotate-45"><Diamond size={12} className="-rotate-45"/></div>}
                </div>
              )
            })}
        </div>
      </div>
      
      {/* Interaction Hint Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-3 backdrop-blur-md shadow-2xl border border-white/10 select-none animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-1.5 text-nexus-400"><Move size={14}/> Click & Drag to Pan</div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="flex items-center gap-1.5 text-nexus-400"><Share2 size={14}/> Click Node to Trace Logic</div>
      </div>
    </div>
  );
};

export default NetworkDiagram;
