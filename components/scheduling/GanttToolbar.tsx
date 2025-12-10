
import React from 'react';
import { Project, TaskStatus } from '../../types';
import { Calendar, AlertTriangle, Layers, Users, ZoomIn, ZoomOut, Save, Filter, Share2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

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

  const handleSetBaseline = () => {
    const name = prompt("Enter baseline name (e.g., 'Phase 1 Approved')", `Baseline ${ (project.baselines?.length || 0) + 1}`);
    if(name) {
        dispatch({ type: 'SET_BASELINE', payload: { projectId: project.id, name } });
    }
  };

  return (
    <div className="flex-shrink-0 h-[52px] bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === mode ? 'bg-nexus-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
                value={taskFilter}
                onChange={e => setTaskFilter(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-nexus-500"
            >
                <option value="all">All Tasks</option>
                <option value="critical">Critical</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DELAYED}>Delayed</option>
            </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button 
            onClick={onTraceLogic}
            disabled={!isTaskSelected}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <Share2 size={16} /> Trace Logic
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
           <AlertTriangle size={16} className="text-red-500" />
           <span className="font-medium">Critical Path</span>
           <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${showCriticalPath ? 'bg-nexus-600' : 'bg-slate-300'}`}>
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${showCriticalPath ? 'translate-x-5' : ''}`} />
           </div>
           <input type="checkbox" checked={showCriticalPath} onChange={() => setShowCriticalPath(!showCriticalPath)} className="hidden" />
        </label>
        
        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
            <Layers size={16} className="text-slate-500"/>
            <select 
              value={activeBaselineId || ''}
              onChange={(e) => setActiveBaselineId(e.target.value || null)}
              className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none text-slate-700 font-medium"
            >
              <option value="">No Baseline</option>
              {project.baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <button onClick={handleSetBaseline} title="Set new baseline" className="p-1 text-slate-500 hover:bg-slate-200 rounded-md">
                <Save size={14} />
            </button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

         <button 
            onClick={() => setShowResources(!showResources)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${showResources ? 'bg-nexus-100 text-nexus-700' : 'text-slate-600 hover:bg-slate-100'}`}
         >
           <Users size={16} /> Resource Plan
        </button>
      </div>
    </div>
  );
};

export default GanttToolbar;
