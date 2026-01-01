


import React, { useMemo, useState, useDeferredValue, useTransition } from 'react';
import { useData } from '../context/DataContext';
import { ShieldAlert, Filter, ArrowUpRight, LayoutGrid, BarChart2, List, Download, Plus, DollarSign, Activity, AlertOctagon, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
// FIX: Corrected import path for Risk type to resolve module resolution error.
import { Risk } from '../types/index';
import { PageHeader } from './common/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { RiskDetailPanel as RiskDetailModal } from './risk/RiskDetailPanel';
import { RiskListView } from './risk/views/RiskListView';
import { RiskMatrixView } from './risk/views/RiskMatrixView';
import { RiskAnalyticsView } from './risk/views/RiskAnalyticsView';

// Helper function extracted outside to ensure purity (Rule 2)
const enrichRiskData = (risk: Risk, projects: any[]) => {
  const project = projects.find(p => p.id === risk.projectId);
  const probPercent = risk.probabilityValue ? risk.probabilityValue * 0.2 : 0.5;
  const financial = risk.financialImpact || 50000; 
  return { ...risk, projectName: project ? project.name : 'Unknown', projectCode: project ? project.code : 'N/A', financialImpact: financial, emv: financial * probPercent };
};

const RiskRegister: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'analytics'>('list');
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm); // Rule 3: Defer search filter

  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  
  // Rule 5: Stable functional update pattern for filters if needed, but here state is simple object
  const [filters, setFilters] = useState({ category: 'All', minScore: 0, owner: 'All' });

  // Rule 12: Compute derived state during render
  const enterpriseRisks = useMemo(() => state.risks.map(r => enrichRiskData(r, state.projects)), [state.risks, state.projects]);
  
  const filteredRisks = useMemo(() => enterpriseRisks.filter(r => 
      (r.description.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || r.projectName.toLowerCase().includes(deferredSearchTerm.toLowerCase())) &&
      (filters.category === 'All' || r.category === filters.category) &&
      (r.score >= filters.minScore) &&
      (filters.owner === 'All' || r.ownerId === filters.owner)
  ), [enterpriseRisks, deferredSearchTerm, filters]);

  const metrics = useMemo(() => ({
    totalExposure: filteredRisks.reduce((sum, r) => sum + r.emv, 0),
    criticalCount: filteredRisks.filter(r => r.score >= 15).length,
    escalatedCount: filteredRisks.filter(r => r.isEscalated).length
  }), [filteredRisks]);

  const exportCSV = () => { /* Export logic */ alert("Exporting CSV..."); };

  const handleViewChange = (mode: 'list' | 'matrix' | 'analytics') => {
      startTransition(() => {
          setViewMode(mode);
      });
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      {selectedRiskId && <RiskDetailModal riskId={selectedRiskId} projectId={enterpriseRisks.find(r => r.id === selectedRiskId)?.projectId || ''} onClose={() => setSelectedRiskId(null)} />}
      <PageHeader title="Enterprise Risk Register" subtitle="Centralized governance of uncertainty." icon={ShieldAlert} actions={<><Button variant="outline" size="sm" onClick={exportCSV} icon={Download}>Export</Button><Button variant="primary" size="sm" icon={Plus}>New Risk</Button></>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className={`${theme.components.card} p-4 flex items-center justify-between`}><div><p className="text-xs text-slate-500 uppercase font-bold">Total EMV</p><p className="text-xl font-bold">{formatCurrency(metrics.totalExposure)}</p></div><DollarSign className="text-slate-300"/></div>
         <div className={`${theme.components.card} p-4 flex items-center justify-between`}><div><p className="text-xs text-slate-500 uppercase font-bold">Active Risks</p><p className="text-xl font-bold">{filteredRisks.length}</p></div><Activity className="text-blue-400"/></div>
         <div className={`${theme.components.card} p-4 flex items-center justify-between`}><div><p className="text-xs text-slate-500 uppercase font-bold">Critical</p><p className="text-xl font-bold text-red-600">{metrics.criticalCount}</p></div><AlertOctagon className="text-red-400"/></div>
         <div className={`${theme.components.card} p-4 flex items-center justify-between`}><div><p className="text-xs text-slate-500 uppercase font-bold">Escalated</p><p className="text-xl font-bold text-orange-500">{metrics.escalatedCount}</p></div><ArrowUpRight className="text-orange-400"/></div>
      </div>

      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col gap-4 bg-slate-50/50`}>
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className={`flex ${theme.colors.surface} border border-slate-200 rounded-lg p-1`}>
                  {['list', 'matrix', 'analytics'].map(m => (
                      <button key={m} onClick={() => handleViewChange(m as any)} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 capitalize ${viewMode === m ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                          {m === 'list' ? <List size={16}/> : m === 'matrix' ? <LayoutGrid size={16}/> : <BarChart2 size={16}/>} {m}
                      </button>
                  ))}
              </div>
              <div className="relative w-full sm:w-64"><Input isSearch placeholder="Search risks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/></div>
           </div>
           <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2"><Filter size={14} className="text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase">Filters:</span></div>
              <select className={`${theme.colors.surface} border text-xs rounded-md px-2 py-1.5`} value={filters.category} onChange={e => setFilters(prev => ({...prev, category: e.target.value}))}><option value="All">All Categories</option><option>Technical</option><option>Schedule</option><option>Cost</option></select>
              <button onClick={() => {setFilters({category:'All', minScore:0, owner:'All'}); setSearchTerm('')}} className="text-xs text-nexus-600 hover:underline ml-auto">Clear Filters</button>
           </div>
        </div>
        
        <div className={`flex-1 overflow-hidden ${theme.colors.surface} relative transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
           {isPending && <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20"><Loader2 className="animate-spin text-nexus-500"/></div>}
           {viewMode === 'list' && <RiskListView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
           {viewMode === 'matrix' && <RiskMatrixView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
           {viewMode === 'analytics' && <RiskAnalyticsView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
        </div>
      </div>
    </div>
  );
};