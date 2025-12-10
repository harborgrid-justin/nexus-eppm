import React, { useMemo } from 'react';
import { Project, Task } from '../../types';
import { Diamond } from 'lucide-react';

interface NetworkDiagramProps {
  project: Project;
}

interface NodeTask extends Task {
  children: string[];
  level: number;
}

const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ project }) => {

  const { nodes, levels } = useMemo(() => {
    const tasks = project.tasks;
    const nodes: NodeTask[] = tasks.map(t => ({ ...t, children: [] as string[], level: -1 }));
    const nodeMap = new Map<string, NodeTask>(nodes.map(n => [n.id, n]));

    tasks.forEach(task => {
      task.dependencies.forEach(dep => {
        const parent = nodeMap.get(dep.targetId);
        if (parent) parent.children.push(task.id);
      });
    });

    const assignLevel = (nodeId: string, level: number) => {
      const node = nodeMap.get(nodeId);
      if (node && node.level < level) {
        node.level = level;
        node.children.forEach(childId => assignLevel(childId, level + 1));
      }
    };

    nodes.forEach(n => {
      if (n.dependencies.length === 0) assignLevel(n.id, 0);
    });

    const levels = nodes.reduce((acc, node) => {
      if (node.level === -1) node.level = 0; // handle disconnected nodes
      if (!acc[node.level]) acc[node.level] = [];
      acc[node.level].push(node);
      return acc;
    }, [] as NodeTask[][]);

    return { nodes, levels };
  }, [project.tasks]);
  
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number, y: number, width: number, height: number }>();
    const LEVEL_WIDTH = 250;
    const NODE_HEIGHT = 120;
    const NODE_WIDTH = 180;
    
    levels.forEach((levelTasks, levelIndex) => {
      const x = levelIndex * LEVEL_WIDTH + 50;
      levelTasks.forEach((task, taskIndex) => {
        const y = taskIndex * NODE_HEIGHT + 50;
        positions.set(task.id, { x, y, width: NODE_WIDTH, height: 100 });
      });
    });
    return positions;
  }, [levels]);

  return (
    <div className="h-full w-full overflow-auto bg-slate-50 p-4 relative">
      <h2 className="text-xl font-bold text-slate-800 p-4">Activity Network Diagram</h2>
      <div className="relative" style={{ width: levels.length * 250, height: Math.max(...levels.map(l => l.length)) * 120 + 100 }}>
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
          {nodes.map(node => 
             node.dependencies.map(dep => {
               const startNodePos = nodePositions.get(dep.targetId);
               const endNodePos = nodePositions.get(node.id);
               if (!startNodePos || !endNodePos) return null;

               const startX = startNodePos.x + startNodePos.width;
               const startY = startNodePos.y + startNodePos.height / 2;
               const endX = endNodePos.x;
               const endY = endNodePos.y + endNodePos.height / 2;
               
               const isCritical = node.critical && project.tasks.find(t=>t.id === dep.targetId)?.critical;

               return <path key={`${node.id}-${dep.targetId}`} d={`M ${startX} ${startY} C ${startX + 80} ${startY}, ${endX - 80} ${endY}, ${endX} ${endY}`} stroke={isCritical ? '#ef4444' : '#94a3b8'} strokeWidth="2" fill="none" markerEnd={`url(#arrow${isCritical ? '-critical': ''})`}/>
             })
          )}
           <defs>
             <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
             <marker id="arrow-critical" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" /></marker>
           </defs>
        </svg>

        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;
          return (
            <div
              key={node.id}
              className={`absolute p-3 rounded-lg shadow-md border-2 ${node.critical ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'} hover:shadow-xl transition-shadow`}
              style={{ left: pos.x, top: pos.y, width: pos.width, height: pos.height, zIndex: 2 }}
            >
              <div className="text-xs font-mono text-slate-500">{node.wbsCode}</div>
              <div className="font-bold text-sm text-slate-800 truncate">{node.name}</div>
              <div className="text-xs text-slate-500 mt-2">Dur: {node.duration}d</div>
              {node.type === 'Milestone' && <Diamond size={12} className="absolute top-2 right-2 text-nexus-600"/>}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default NetworkDiagram;