import React from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

interface Props {
  onGenerateReport: () => void;
  isGenerating: boolean;
  viewType: 'financial' | 'strategic';
  onViewChange: (type: 'financial' | 'strategic') => void;
}

export const DashboardHeader: React.FC<Props> = ({ onGenerateReport, isGenerating, viewType, onViewChange }) => {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Executive Portfolio Overview</h3>
        <p className="text-sm text-slate-500 font-medium">Consolidated KPIs for organizational investment and delivery.</p>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200 shadow-inner">
          <button 
            onClick={() => onViewChange('financial')} 
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'financial' ? 'bg-white shadow-sm text-nexus-700 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Financial
          </button>
          <button 
            onClick={() => onViewChange('strategic')} 
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewType === 'strategic' ? 'bg-white shadow-sm text-nexus-700 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Strategic
          </button>
        </div>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
        <button 
            onClick={onGenerateReport} 
            disabled={isGenerating} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 text-slate-700 shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
        >
            <Sparkles size={16} className={isGenerating ? "text-slate-400 animate-pulse" : "text-yellow-500"}/> 
            {isGenerating ? 'Analyzing...' : 'AI Briefing'}
        </button>
        {hasPermission('system:configure') && (
            <button 
                onClick={() => navigate('/getting-started')} 
                className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-bold text-white flex items-center gap-2 hover:bg-nexus-700 shadow-md shadow-nexus-500/20 transition-all active:scale-95"
            >
                <Globe size={16} /> Provision Portfolio
            </button>
        )}
      </div>
    </div>
  );
};