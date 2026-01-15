
import React, { useState } from 'react';
import { Project, EPSNode } from '../../../types/index';
import { useData } from '../../../context/DataContext';
import { ChevronRight, ChevronDown, Folder, Briefcase, Target, Layers } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';
// Fix: Added missing import for StatusBadge component
import { StatusBadge } from '../../common/StatusBadge';

interface EpsTreeViewProps {
  projects: Project[];
  onSelect: (id: string) => void;
}

export const EpsTreeView: React.FC<EpsTreeViewProps> = ({ projects, onSelect }) => {
  const { state } = useData();
  const theme = useTheme();
  const [expandedEps, setExpandedEps] = useState<Set<string>>(new Set(state.eps.map(e => e.id)));

  const toggleEps = (id: string) => {
    const newSet = new Set(expandedEps);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setExpandedEps(newSet);
  };

  const renderEpsNode = (node: EPSNode, level: number = 0) => {
    const nodeProjects = projects.filter(p => p.epsId === node.id);
    const childNodes = state.eps.filter(e => e.parentId === node.id);
    const hasChildren = nodeProjects.length > 0 || childNodes.length > 0;
    const isExpanded = expandedEps.has(node.id);

    if (!hasChildren && level > 0) return null;

    return (
      <React.Fragment key={node.id}>
        <div 
          className={`flex items-center px-6 py-4 bg-white border-b ${theme.colors.border} hover:bg-slate-50 cursor-pointer select-none transition-all sticky top-0 z-[10] group`}
          style={{ paddingLeft: `${level * 24 + 24}px` }}
          onClick={() => toggleEps(node.id)}
        >
          <span className={`mr-4 ${theme.colors.text.tertiary} flex-shrink-0 group-hover:text-nexus-600 transition-colors`}>
            {hasChildren ? (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />) : <div className="w-5" />}
          </span>
          <Folder size={18} className="text-nexus-500 mr-4 flex-shrink-0 fill-nexus-50 group-hover:fill-nexus-100 transition-all" />
          <span className={`font-black text-xs uppercase tracking-[0.15em] text-slate-700 truncate flex-1`}>{node.name}</span>
          <span className={`ml-3 text-[10px] font-mono font-black text-slate-300 uppercase tracking-tighter shrink-0`}>({node.code})</span>
          {nodeProjects.length > 0 && (
            <span className={`ml-6 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full shadow-lg shrink-0`}>
                {nodeProjects.length} Initiatives
            </span>
          )}
        </div>
        
        {isExpanded && (
          <div className="flex flex-col animate-nexus-in bg-slate-50/20 shadow-inner">
            {nodeProjects.map(project => (
               <div 
                key={project.id} 
                onClick={() => onSelect(project.id)} 
                className={`group flex items-center px-6 py-5 border-b border-slate-100 hover:bg-white cursor-pointer transition-all border-l-[6px] border-l-transparent hover:border-l-nexus-500 hover:shadow-lg hover:z-20 relative`} 
                style={{ paddingLeft: `${(level + 1) * 24 + 56}px` }}
               >
                  <div className="flex-1 flex min-w-0 items-center justify-between gap-8">
                      <div className="flex-1 min-w-0">
                          <div className={`font-black text-sm text-slate-900 group-hover:text-nexus-700 truncate uppercase tracking-tight transition-colors`}>{project.name}</div>
                          <div className={`text-[10px] text-slate-400 font-mono font-bold mt-1 truncate uppercase tracking-tighter`}>{project.code} • {project.managerId}</div>
                      </div>
                      <div className={`hidden lg:flex items-center gap-6 shrink-0`}>
                          <div className="text-right">
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Authority</p>
                              <p className="text-sm font-mono font-black text-slate-700">{formatCompactCurrency(project.budget)}</p>
                          </div>
                          <StatusBadge status={project.health} variant="health" className="scale-75 origin-right" />
                      </div>
                  </div>
               </div>
            ))}
            {childNodes.map(child => renderEpsNode(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  if (state.eps.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid title="Partition Model Offline" description="The Enterprise Project Structure (EPS) hierarchy is required for categorized project navigation." icon={Layers} />
          </div>
      );
  }

  return (
    <div className={`flex-1 h-full overflow-auto bg-white scrollbar-thin`}>
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8 border-b border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-nexus-400">Enterprise Structure Explorer</h3>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Root Partition: {state.eps[0]?.code}</span>
        </div>
        {state.eps.filter(e => !e.parentId).map(node => renderEpsNode(node))}
    </div>
  );
};
