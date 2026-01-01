


import React from 'react';
// FIX: Corrected import path for types to resolve module resolution errors.
import { Project, TaskStatus } from '../../types/index';
import { Calendar, AlertTriangle, Layers, Users, ZoomIn, ZoomOut, Save, Filter, Share2, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

interface GanttToolbarProps {
  project: Project;
  viewMode: 'day' | 'week' | 'month';
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  showCriticalPath: boolean;
  setShowCriticalPath: (show: boolean) => void;
  activeBaselineId: string | null;
  setActiveBaselineId: (id: string | null) => void;
  showResources: boolean;
  setShowResources: (show: boolean) => void;
  onTraceLogic: () => void;
  isTaskSelected: boolean;
  taskFilter: string;
  setTaskFilter: (filter: string) => void;
}

const GanttToolbar: React.FC<GanttToolbarProps> = ({
  project,
  viewMode,
  setViewMode,
  showCriticalPath,
  setShowCriticalPath,
  activeBaselineId,
  setActiveBaselineId,
  showResources,
  setShowResources,
  onTraceLogic,
  isTaskSelected,
  taskFilter,
  setTaskFilter,
}) => {
  const { dispatch } = useData();
  const theme = useTheme();

  const handleSetBaseline = () => {
    const name = prompt("Enter baseline name (e.g., 'Phase 1 Approved')", `Baseline ${ (project.baselines?.length || 0) + 1}`);
    if(name) {
        dispatch({ type: 'BASELINE_SET', payload: { projectId: project.id, name } });
    }
  };

  return (
    <div className={`flex-shrink-0 h-[56px] ${theme.colors.surface} border-b ${theme.colors.border} flex items-center justify-between px-6 z-20 shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1 bg-slate-100 p-1 rounded-xl border ${theme.colors.border} shadow-inner`}>
          {(['day', 'week', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                viewMode === mode ? `${theme.colors.surface} text-nexus-700 shadow-sm` : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-slate-200" />

        <div className="relative group">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-500 transition-colors" />
            <select 
                value={taskFilter}
                onChange={e => setTaskFilter(e.target.value)}
                className={`pl-9 pr-8 py-2 text-xs font-bold text-slate-600 ${theme.colors.surface} border ${theme.colors.border} rounded-xl appearance-none focus:outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 hover:border-slate-300 transition-all cursor-pointer`}
            >
                <option value="all">All Activities</option>
                <option value="critical">Critical Path</option>
                <option value={TaskStatus.IN_PROGRESS}>Status: In Progress</option>
                <option value={TaskStatus.DELAYED}>Status: Delayed</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
            onClick={onTraceLogic}
            disabled={!isTaskSelected}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition-all text-slate-600 ${theme.colors.surface} border ${theme.colors.border} hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95`}
         >
           <Share2 size={16} className="text-nexus-500" /> Trace Logic
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button 
           onClick={() => setShowCriticalPath(!showCriticalPath)} // Functional update depends on parent implementation
           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm active:scale-95 ${
               showCriticalPath 
               ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500/10' 
               : `${theme.colors.surface} ${theme.colors.border} text-slate-600 hover:bg-slate-50 hover:border-slate-300`
           }`}
        >
           <AlertTriangle size={16} className={showCriticalPath ? 'text-red-500' : 'text-slate-400'} />
           Critical Path
        </button>
        
        <div className="relative group">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                activeBaselineId ? 'bg-nexus-50 border-nexus-200 ring-2 ring-nexus-500/10' : `${theme.colors.surface} ${theme.colors.border}`
            }`}>
                <Layers size={16} className={activeBaselineId ? 'text-nexus-600' : 'text-slate-400'}/>
                <select 
                  value={activeBaselineId || ''}
                  onChange={(e) => setActiveBaselineId(e.target.value || null)}
                  className="text-xs bg-transparent border-none focus:ring-0 focus:outline-none text-slate-700 font-bold pr-2 cursor-pointer"
                >
                  <option value="">No Baseline</option>
                  {project.baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <button onClick={handleSetBaseline} title="Capture baseline" className="p-1 hover:bg-white rounded-md transition-colors">
                    <Save size={14} className="text-slate-400 hover:text-nexus-600" />
                </button>
            </div>
        </div>

         <button 
            onClick={() => setShowResources(!showResources)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border shadow-sm active:scale-95 ${
                showResources 
                ? 'bg-nexus-100 border-nexus-200 text-nexus-800' 
                : `${theme.colors.surface} ${theme.colors.border} text-slate-600 hover:bg-slate-50`
            }`}
         >
           <Users size={16} className={showResources ? 'text-nexus-600' : 'text-slate-400'} /> 
           {showResources ? 'Hide Resources' : 'Show Resources'}
        </button>
      </div>
    </div>
  );
};

export default GanttToolbar;