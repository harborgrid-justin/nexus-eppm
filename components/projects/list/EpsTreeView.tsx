
import React, { useState } from 'react';
import { Project, EPSNode } from '../../../types';
import { useData } from '../../../context/DataContext';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

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
          className={`flex items-center px-4 py-2.5 ${theme.colors.background} border-b ${theme.colors.border} hover:${theme.colors.surface} cursor-pointer select-none transition-colors sticky top-0 z-[5]`}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
          onClick={() => toggleEps(node.id)}
        >
          <span className={`mr-3 ${theme.colors.text.tertiary} flex-shrink-0`}>
            {hasChildren ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <div className="w-4" />}
          </span>
          <Folder size={16} className="text-nexus-500 mr-2 flex-shrink-0" />
          <span className={`font-bold text-sm ${theme.colors.text.primary} truncate`}>{node.name}</span>
          <span className={`ml-2 text-[10px] ${theme.colors.text.tertiary} font-mono flex-shrink-0`}>({node.code})</span>
          {nodeProjects.length > 0 && <span className={`ml-auto text-[10px] font-bold ${theme.colors.surface} border ${theme.colors.border} px-2 py-0.5 rounded-full ${theme.colors.text.secondary} flex-shrink-0`}>{nodeProjects.length} Projects</span>}
        </div>
        
        {isExpanded && (
          <div className="flex flex-col">
            {nodeProjects.map(project => (
               <div key={project.id} onClick={() => onSelect(project.id)} className={`group flex items-center px-4 py-4 border-b ${theme.colors.border.replace('border-','border-slate-').replace('200','100')} hover:bg-nexus-50/10 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-nexus-500`} style={{ paddingLeft: `${(level + 1) * 24 + 36}px` }}>
                  <div className="flex-1 flex min-w-0 items-center gap-6">
                      <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${theme.colors.text.primary} group-hover:text-nexus-600 truncate`}>{project.name}</div>
                          <div className={`text-[10px] ${theme.colors.text.secondary} font-mono truncate`}>{project.code}</div>
                      </div>
                      <div className={`hidden lg:block w-32 text-right text-sm font-mono ${theme.colors.text.secondary} flex-shrink-0`}>{formatCompactCurrency(project.budget)}</div>
                  </div>
               </div>
            ))}
            {childNodes.map(child => renderEpsNode(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return <div className={`flex-1 h-full overflow-auto ${theme.colors.surface}`}>{state.eps.filter(e => !e.parentId).map(node => renderEpsNode(node))}</div>;
};
