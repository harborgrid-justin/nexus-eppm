
import React from 'react';
import { ShieldAlert, Filter, ArrowUpRight, LayoutGrid, BarChart2, List, Download, Plus, DollarSign, Activity, AlertOctagon, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PageHeader } from './common/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { RiskDetailPanel as RiskDetailModal } from './risk/RiskDetailPanel';
import { RiskListView } from './risk/views/RiskListView';
import { RiskMatrixView } from './risk/views/RiskMatrixView';
import { RiskAnalyticsView } from './risk/views/RiskAnalyticsView';
import { useRiskRegisterLogic } from '../hooks/domain/useRiskRegisterLogic';

const RiskRegister: React.FC = () => {
  // Consuming the business logic hook
  const {
    viewMode,
    searchTerm,
    deferredSearchTerm,
    selectedRiskId,
    isPending,
    filteredRisks,
    metrics,
    setSearchTerm,
    setSelectedRiskId,
    handleViewChange
  } = useRiskRegisterLogic();

  return (
    <div className="p-[var(--spacing-gutter)] space-y-4 h-full flex flex-col">
      {selectedRiskId && (
        <RiskDetailModal 
            riskId={selectedRiskId} 
            projectId={filteredRisks.find(r => r.id === selectedRiskId)?.projectId || ''} 
            onClose={() => setSelectedRiskId(null)} 
        />
      )}
      
      <PageHeader 
        title="Enterprise Risk Register" 
        subtitle="Centralized governance of uncertainty." 
        icon={ShieldAlert} 
        actions={<><Button variant="outline" size="sm" icon={Download}>Export</Button><Button variant="primary" size="sm" icon={Plus}>New Risk</Button></>} 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"><div className="space-y-1"><p className="text-xs text-text-secondary uppercase font-bold">Total EMV</p><p className="text-xl font-bold font-mono">{formatCurrency(metrics.totalExposure)}</p></div><DollarSign className="text-slate-300"/></div>
         <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"><div className="space-y-1"><p className="text-xs text-text-secondary uppercase font-bold">Active Risks</p><p className="text-xl font-bold">{metrics.activeCount}</p></div><Activity className="text-blue-400"/></div>
         <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"><div className="space-y-1"><p className="text-xs text-text-secondary uppercase font-bold">Critical</p><p className="text-xl font-bold text-red-600">{metrics.criticalCount}</p></div><AlertOctagon className="text-red-400"/></div>
         <div className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"><div className="space-y-1"><p className="text-xs text-text-secondary uppercase font-bold">Escalated</p><p className="text-xl font-bold text-orange-500">{metrics.escalatedCount}</p></div><ArrowUpRight className="text-orange-400"/></div>
      </div>

      <div className="flex flex-col flex-1 bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col gap-4 bg-slate-50/50">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex bg-surface border border-slate-200 rounded-lg p-1">
                  {['list', 'matrix', 'analytics'].map(m => (
                      <button key={m} onClick={() => handleViewChange(m as any)} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 capitalize transition-all ${viewMode === m ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                          {m === 'list' ? <List size={16}/> : m === 'matrix' ? <LayoutGrid size={16}/> : <BarChart2 size={16}/>} {m}
                      </button>
                  ))}
              </div>
              <div className="relative w-full sm:w-64">
                  <Input 
                    isSearch 
                    placeholder="Search risks..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full"
                  />
                  {searchTerm !== deferredSearchTerm && <div className="absolute right-10 top-1/2 -translate-y-1/2"><Loader2 size={14} className="animate-spin text-slate-300"/></div>}
              </div>
           </div>
        </div>
        
        <div className={`flex-1 overflow-hidden bg-surface relative transition-opacity duration-200 ${isPending || searchTerm !== deferredSearchTerm ? 'opacity-60' : 'opacity-100'}`}>
           {(isPending || searchTerm !== deferredSearchTerm) && <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20 backdrop-blur-[1px]"><Loader2 className="animate-spin text-nexus-500" size={32}/></div>}
           {viewMode === 'list' && <RiskListView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
           {viewMode === 'matrix' && <RiskMatrixView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
           {viewMode === 'analytics' && <RiskAnalyticsView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
        </div>
      </div>
    </div>
  );
};
export default RiskRegister;
