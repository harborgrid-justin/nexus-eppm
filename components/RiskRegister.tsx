
import React from 'react';
import { ShieldAlert, BarChart2, List, Download, Plus, DollarSign, Activity, AlertOctagon, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PageHeader } from './common/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { RiskDetailPanel as RiskDetailModal } from './risk/RiskDetailPanel';
import { RiskListView } from './risk/views/RiskListView';
import { RiskMatrixView } from './risk/views/RiskMatrixView';
import { RiskAnalyticsView } from './risk/views/RiskAnalyticsView';
import { useRiskRegisterLogic } from '../hooks/domain/useRiskRegisterLogic';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import StatCard from './shared/StatCard';
import { EmptyGrid } from './common/EmptyGrid';

const RiskRegister: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const {
    viewMode, searchTerm, deferredSearchTerm, selectedRiskId, isPending,
    filteredRisks, metrics, setSearchTerm, setSelectedRiskId, handleViewChange
  } = useRiskRegisterLogic();

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background}`}>
      {selectedRiskId && (
        <RiskDetailModal 
            riskId={selectedRiskId} 
            projectId={filteredRisks.find(r => r.id === selectedRiskId)?.projectId || ''} 
            onClose={() => setSelectedRiskId(null)} 
        />
      )}
      
      <PageHeader 
        title={t('risk.registry_title', 'Enterprise Risk Register')} 
        subtitle={t('risk.registry_subtitle', 'Centralized governance of project uncertainty.')} 
        icon={ShieldAlert} 
        actions={
          <>
            <Button variant="outline" size="sm" icon={Download}>{t('common.export', 'Export')}</Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setSelectedRiskId('NEW')}>{t('risk.new', 'New Risk')}</Button>
          </>
        } 
      />

      <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
         <StatCard title={t('risk.total_emv', 'Total EMV')} value={formatCurrency(metrics.totalExposure)} icon={DollarSign} />
         <StatCard title={t('risk.active_count', 'Active Risks')} value={metrics.activeCount} icon={Activity} />
         <StatCard title={t('risk.critical', 'Critical Threats')} value={metrics.criticalCount} icon={AlertOctagon} />
         <StatCard title={t('risk.escalated', 'Escalated')} value={metrics.escalatedCount} icon={ArrowUpRight} />
      </div>

      <div className={`mt-8 flex flex-col flex-1 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50`}>
            <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border} shadow-inner`}>
                {['list', 'matrix', 'analytics'].map(m => (
                    <button key={m} onClick={() => handleViewChange(m as any)} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 capitalize transition-all ${viewMode === m ? `${theme.colors.surface} text-nexus-700 shadow-sm font-black` : `${theme.colors.text.tertiary} hover:${theme.colors.text.secondary}`}`}>
                        {m === 'list' ? <List size={14}/> : m === 'matrix' ? <LayoutGrid size={14}/> : <BarChart2 size={14}/>} {m}
                    </button>
                ))}
            </div>
            <Input 
                isSearch 
                placeholder={t('risk.search', 'Search risks...')} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full sm:w-64"
            />
        </div>
        
        <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
           {filteredRisks.length > 0 ? (
               <>
                {viewMode === 'list' && <RiskListView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
                {viewMode === 'matrix' && <RiskMatrixView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
                {viewMode === 'analytics' && <RiskAnalyticsView risks={filteredRisks} onSelectRisk={setSelectedRiskId} />}
               </>
           ) : (
                <EmptyGrid 
                    title={t('risk.empty', 'Risk Inventory Neutral')} 
                    description={t('risk.empty_desc', 'The risk registry for this partition is currently clear of threats.')}
                    icon={ShieldAlert}
                    onAdd={() => setSelectedRiskId('NEW')}
                    actionLabel={t('risk.init_action', 'Identify Risk')}
                />
           )}
        </div>
      </div>
    </div>
  );
};
export default RiskRegister;
