
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldAlert, Filter, ArrowUpRight, LayoutGrid, BarChart2, List, 
  Download, Plus, Search, Layers, DollarSign, Activity, AlertOctagon, CheckSquare 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import DataTable, { Column } from './common/DataTable';
import { Risk } from '../types';
import { PageHeader } from './common/PageHeader';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import RiskMatrix from './risk/RiskMatrix'; // Reusing existing component for Matrix View
import { CustomPieChart } from './charts/CustomPieChart';
import RiskDetailModal from './risk/RiskDetailModal';

// Mock function to enrich data (simulating DB join)
const enrichRiskData = (risk: Risk, projects: any[]) => {
  const project = projects.find(p => p.id === risk.projectId);
  // Calculate EMV if not present (Simple: Score/25 * Financial Impact)
  const probPercent = risk.probabilityValue ? risk.probabilityValue * 0.2 : 0.5;
  const financial = risk.financialImpact || 50000; // Default mock value
  const emv = financial * probPercent;

  return {
    ...risk,
    projectName: project ? project.name : 'Unknown Project',
    projectCode: project ? project.code : 'N/A',
    financialImpact: financial,
    emv: emv
  };
};

const RiskRegister: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  
  // --- STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'analytics'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [filterOwner, setFilterOwner] = useState('All');

  // --- DATA PROCESSING ---
  const enterpriseRisks = useMemo(() => {
    return state.risks.map(risk => enrichRiskData(risk, state.projects));
  }, [state.risks, state.projects]);

  const filteredRisks = useMemo(() => {
    return enterpriseRisks.filter(r => 
      (r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
       r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       r.owner.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'All' || r.category === filterCategory) &&
      (r.score >= filterMinScore) &&
      (filterOwner === 'All' || r.owner === filterOwner)
    );
  }, [enterpriseRisks, searchTerm, filterCategory, filterMinScore, filterOwner]);

  // --- AGGREGATE METRICS ---
  const metrics = useMemo(() => {
    const totalExposure = filteredRisks.reduce((sum, r) => sum + r.emv, 0);
    const criticalCount = filteredRisks.filter(r => r.score >= 15).length;
    const escalatedCount = filteredRisks.filter(r => r.isEscalated).length;
    return { totalExposure, criticalCount, escalatedCount };
  }, [filteredRisks]);

  // --- CHARTS DATA ---
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRisks.forEach(r => counts[r.category] = (counts[r.category] || 0) + 1);
    const colors = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];
    return Object.entries(counts).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
  }, [filteredRisks]);

  // --- UI HELPERS ---
  const getScoreVariant = (score: number) => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  const exportCSV = () => {
    const headers = ['ID', 'Project', 'Description', 'Category', 'Score', 'EMV', 'Strategy', 'Owner', 'Status'];
    const rows = filteredRisks.map(r => [
      r.id, r.projectName, `"${r.description}"`, r.category, r.score, r.emv, r.strategy, r.owner, r.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk_register_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // --- COLUMNS DEFINITION ---
  const columns: Column<typeof enterpriseRisks[0]>[] = [
    {
      key: 'id',
      header: 'Risk ID',
      width: 'w-24',
      render: (r) => <span className="font-mono text-xs text-slate-500">{r.id}</span>,
      sortable: true
    },
    {
      key: 'projectName',
      header: 'Project Context',
      render: (r) => (
        <div>
          <div className="text-sm font-medium text-slate-900">{r.projectName}</div>
          <div className="text-xs text-slate-500 font-mono">{r.projectCode}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'description',
      header: 'Description',
      render: (r) => (
        <div>
           <span className="text-sm text-slate-700 truncate block max-w-xs" title={r.description}>{r.description}</span>
           {r.isEscalated && <span className="text-[10px] text-red-600 font-bold flex items-center gap-1"><ArrowUpRight size={10}/> Escalated</span>}
        </div>
      ),
      sortable: true
    },
    {
      key: 'score',
      header: 'Score',
      align: 'center',
      render: (r) => <Badge variant={getScoreVariant(r.score)}>{r.score}</Badge>,
      sortable: true
    },
    {
      key: 'emv',
      header: 'Exposure (EMV)',
      align: 'right',
      render: (r) => <span className="font-mono text-sm">{formatCompactCurrency(r.emv)}</span>,
      sortable: true
    },
    {
      key: 'strategy',
      header: 'Strategy',
      render: (r) => <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">{r.strategy}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={r.status === 'Closed' ? 'neutral' : r.status === 'Open' ? 'warning' : 'success'}>{r.status}</Badge>,
      sortable: true
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (r) => <span className="text-sm text-slate-600">{r.owner}</span>,
      sortable: true
    }
  ];

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      {/* Detail Modal */}
      {selectedRiskId && (
        <RiskDetailModal 
          riskId={selectedRiskId} 
          projectId={enterpriseRisks.find(r => r.id === selectedRiskId)?.projectId || ''}
          onClose={() => setSelectedRiskId(null)}
        />
      )}

      <PageHeader 
        title="Enterprise Risk Register" 
        subtitle="Centralized governance of uncertainty across the entire portfolio."
        icon={ShieldAlert}
        actions={
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={exportCSV} icon={Download}>Export</Button>
             <Button variant="primary" size="sm" icon={Plus}>New Risk</Button>
          </div>
        }
      />

      {/* Aggregate KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs text-slate-500 uppercase font-bold">Total EMV Exposure</p>
               <p className="text-xl font-bold text-slate-900">{formatCurrency(metrics.totalExposure)}</p>
            </div>
            <DollarSign className="text-slate-300" size={24}/>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs text-slate-500 uppercase font-bold">Active Risks</p>
               <p className="text-xl font-bold text-slate-900">{filteredRisks.length}</p>
            </div>
            <Activity className="text-blue-400" size={24}/>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs text-slate-500 uppercase font-bold">Critical Threats</p>
               <p className="text-xl font-bold text-red-600">{metrics.criticalCount}</p>
            </div>
            <AlertOctagon className="text-red-400" size={24}/>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs text-slate-500 uppercase font-bold">Escalated</p>
               <p className="text-xl font-bold text-orange-500">{metrics.escalatedCount}</p>
            </div>
            <ArrowUpRight className="text-orange-400" size={24}/>
         </div>
      </div>

      <div className={theme.layout.panelContainer}>
        {/* Toolbar & Filters */}
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col gap-4 bg-slate-50/50`}>
           {/* Top Row: View Switcher & Search */}
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                  <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <List size={16}/> List
                  </button>
                  <button onClick={() => setViewMode('matrix')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'matrix' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <LayoutGrid size={16}/> Heatmap
                  </button>
                  <button onClick={() => setViewMode('analytics')} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'analytics' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <BarChart2 size={16}/> Analytics
                  </button>
              </div>
              
              <div className="relative w-full sm:w-64">
                  <Input 
                    isSearch 
                    placeholder="Search risks, owners..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
              </div>
           </div>

           {/* Bottom Row: Advanced Filters */}
           <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400"/>
                  <span className="text-xs font-bold text-slate-500 uppercase">Filters:</span>
              </div>
              <select className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1.5 focus:ring-nexus-500" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="External">External</option>
                  <option value="Resource">Resource</option>
                  <option value="Schedule">Schedule</option>
              </select>
              <select className="bg-white border border-slate-200 text-xs rounded-md px-2 py-1.5 focus:ring-nexus-500" value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)}>
                  <option value="All">All Owners</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Mike Ross">Mike Ross</option>
                  <option value="Sarah Chen">Sarah Chen</option>
              </select>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-2 py-1">
                  <span className="text-xs text-slate-500">Min Score:</span>
                  <input 
                    type="number" 
                    min="0" max="25" 
                    value={filterMinScore} 
                    onChange={(e) => setFilterMinScore(parseInt(e.target.value) || 0)}
                    className="w-10 text-xs border-none focus:ring-0 p-0 text-center"
                  />
              </div>
              <button onClick={() => {setFilterCategory('All'); setFilterMinScore(0); setFilterOwner('All'); setSearchTerm('')}} className="text-xs text-nexus-600 hover:underline ml-auto">
                  Clear Filters
              </button>
           </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white">
           {viewMode === 'list' && (
             <div className="h-full p-0">
               <DataTable 
                 data={filteredRisks}
                 columns={columns}
                 keyField="id"
                 onRowClick={(r) => setSelectedRiskId(r.id)}
                 emptyMessage="No risks match your criteria."
               />
             </div>
           )}

           {viewMode === 'matrix' && (
             <div className="h-full p-6 overflow-auto flex flex-col items-center">
                {/* Reuse existing RiskMatrix but pass all filtered risks. Note: RiskMatrix currently takes projectId. We need to refactor it or mock it to accept a risk list. 
                    For this implementation, we will assume RiskMatrix handles projectID filtering internally, so we might need a prop to pass raw risks or just show "Select a project to view matrix" if it strictly requires one.
                    Alternatively, we can adapt the RiskMatrix component or inline a simple one here. Let's inline a simple enterprise matrix.
                */}
                <div className="w-full max-w-4xl">
                    <h3 className="font-bold text-slate-800 mb-6 text-center">Enterprise Probability-Impact Matrix</h3>
                    <div className="grid grid-cols-[auto_1fr] gap-4">
                        <div className="flex items-center justify-center -rotate-90 font-bold text-sm text-slate-500 uppercase tracking-widest">Probability</div>
                        <div className="relative">
                            <div className="grid grid-cols-5 grid-rows-5 gap-1 w-full aspect-square border-l-2 border-b-2 border-slate-300">
                                {/* Generate cells 5x5 */}
                                {[5,4,3,2,1].map(prob => 
                                    [1,2,3,4,5].map(imp => {
                                        const score = prob * imp;
                                        const cellRisks = filteredRisks.filter(r => r.probabilityValue === prob && r.impactValue === imp);
                                        let bgClass = 'bg-green-50';
                                        if (score >= 15) bgClass = 'bg-red-100';
                                        else if (score >= 8) bgClass = 'bg-yellow-100';

                                        return (
                                            <div key={`${prob}-${imp}`} className={`${bgClass} border border-white p-2 relative group hover:brightness-95 transition-all`}>
                                                <div className="absolute inset-0 flex flex-wrap content-start p-1 gap-1 overflow-hidden">
                                                    {cellRisks.map(r => (
                                                        <div 
                                                            key={r.id} 
                                                            className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-transform shadow-sm"
                                                            title={`${r.id}: ${r.description}`}
                                                            onClick={() => setSelectedRiskId(r.id)}
                                                        >
                                                            {cellRisks.length > 5 ? '' : r.id.split('-')[1] || r.id.substring(0,2)}
                                                        </div>
                                                    ))}
                                                    {cellRisks.length > 5 && <span className="text-xs text-slate-500 font-bold pl-1">+{cellRisks.length}</span>}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="text-center font-bold text-sm text-slate-500 uppercase tracking-widest mt-2">Impact</div>
                        </div>
                    </div>
                </div>
             </div>
           )}

           {viewMode === 'analytics' && (
             <div className="h-full p-6 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={18}/> Risk Category Distribution</h3>
                        <CustomPieChart 
                            data={categoryData}
                            height={300}
                        />
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckSquare size={18}/> Top 5 Risks by EMV</h3>
                        <div className="space-y-4">
                            {filteredRisks.sort((a,b) => b.emv - a.emv).slice(0, 5).map(r => (
                                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100" onClick={() => setSelectedRiskId(r.id)}>
                                    <div>
                                        <div className="font-bold text-sm text-slate-900">{r.description}</div>
                                        <div className="text-xs text-slate-500">{r.projectName}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-nexus-700">{formatCompactCurrency(r.emv)}</div>
                                        <Badge variant={getScoreVariant(r.score)}>Score: {r.score}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RiskRegister;