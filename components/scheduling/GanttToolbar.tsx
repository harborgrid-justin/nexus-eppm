
import React from 'react';
import { Project, TaskStatus } from '../../types/index';
import { Calendar, AlertTriangle, Layers, Users, ZoomIn, ZoomOut, Save, Filter, Share2, ChevronDown, Play, FileText, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

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
  onSchedule: () => void;
  isScheduling: boolean;
  onViewLog: () => void;
  dataDate: Date;
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
  onSchedule,
  isScheduling,
  onViewLog,
  dataDate
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
    <div className={`flex-shrink-0 h-16 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center justify-between px-6 z-20 shadow-sm`}>
      <div className="flex items-center gap-3">
        {/* Scheduling Controls */}
        <div className={`flex items-center gap-1 ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
             <Button 
                size="sm" 
                variant="primary" 
                icon={Play} 
                onClick={onSchedule} 
                isLoading={isScheduling}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md"
             >
                Schedule (F9)
             </Button>
             <button onClick={onViewLog} className={`p-2 ${theme.colors.text.secondary} hover:${theme.colors.text.primary} hover:${theme.colors.surface} rounded-md transition-all`} title="View Schedule Log">
                 <FileText size={16}/>
             </button>
        </div>

        <div className="flex flex-col">
            <span className={`text-[9px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest pl-1`}>Data Date</span>
            <div className={`flex items-center gap-1 text-xs font-mono font-bold ${theme.colors.text.primary} ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border}`}>
                <Clock size={12}/> {dataDate.toLocaleDateString()}
            </div>
        </div>

        <div className={`h-8 w-px ${theme.colors.border} mx-2`} />
        
        <div className={`flex items-center gap-1 ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border} shadow-inner`}>
          {(['day', 'week', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 whitespace-nowrap ${
                viewMode === mode ? `${theme.colors.surface} text-nexus-700 shadow-sm font-black` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
            <Filter size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text.tertiary} group-focus-within:text-nexus-500 transition-colors`} />
            <select 
                value={taskFilter}
                onChange={e => setTaskFilter(e.target.value)}
                className={`pl-9 pr-8 py-1.5 text-xs font-bold ${theme.colors.text.secondary} ${theme.colors.surface} border ${theme.colors.border} rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-nexus-500 hover:border-slate-300 transition-all cursor-pointer w-40`}
            >
                <option value="all">All Activities</option>
                <option value="critical">Critical Path</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DELAYED}>Delayed</option>
            </select>
            <ChevronDown size={12} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text.tertiary} pointer-events-none`} />
        </div>

        <button 
            onClick={onTraceLogic}
            disabled={!isTaskSelected}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${theme.colors.text.secondary} ${theme.colors.surface} border ${theme.colors.border} hover:border-slate-300 hover:${theme.colors.background} disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95`}
         >
           <Share2 size={14} className="text-nexus-500" /> Trace Logic
        </button>

        <button 
           onClick={() => setShowCriticalPath(!showCriticalPath)} 
           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm active:scale-95 ${
               showCriticalPath 
               ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500/20' 
               : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary} hover:${theme.colors.background} hover:border-slate-300`
           }`}
        >
           <AlertTriangle size={14} className={showCriticalPath ? 'text-red-500' : 'text-slate-400'} />
           Critical Path
        </button>
        
        <div className="relative group">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                activeBaselineId ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-500/20' : `${theme.colors.surface} ${theme.colors.border}`
            }`}>
                <Layers size={14} className={activeBaselineId ? 'text-amber-600' : 'text-slate-400'}/>
                <select 
                  value={activeBaselineId || ''}
                  onChange={(e) => setActiveBaselineId(e.target.value || null)}
                  className={`text-xs bg-transparent border-none focus:ring-0 focus:outline-none ${theme.colors.text.primary} font-bold pr-1 cursor-pointer w-24`}
                >
                  <option value="">No Baseline</option>
                  {project.baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <button onClick={handleSetBaseline} title="Capture baseline" className={`p-1 hover:${theme.colors.background} rounded-md transition-colors`}>
                    <Save size={12} className={`text-slate-400 hover:text-nexus-600`} />
                </button>
            </div>
        </div>

         <button 
            onClick={() => setShowResources(!showResources)}
            className={`p-2 rounded-lg transition-all border shadow-sm active:scale-95 ${
                showResources 
                ? 'bg-nexus-50 border-nexus-200 text-nexus-600' 
                : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.tertiary} hover:${theme.colors.background}`
            }`}
            title="Toggle Resources"
         >
           <Users size={16} /> 
        </button>
      </div>
    </div>
  );
};

export default GanttToolbar;
