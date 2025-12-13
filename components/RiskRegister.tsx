
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { ShieldAlert, Filter, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import DataTable, { Column } from './common/DataTable';
import { Risk } from '../types';
import { PageHeader } from './common/PageHeader';

const RiskRegister: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Enrich risks with Project Name for the Enterprise View
  const enterpriseRisks = useMemo(() => {
    return state.risks.map(risk => {
      const project = state.projects.find(p => p.id === risk.projectId);
      return {
        ...risk,
        projectName: project ? project.name : 'Unknown Project',
        projectCode: project ? project.code : 'N/A'
      };
    });
  }, [state.risks, state.projects]);

  const filteredRisks = useMemo(() => {
    return enterpriseRisks.filter(r => 
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enterpriseRisks, searchTerm]);

  const getScoreVariant = (score: number) => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  const columns: Column<Risk & { projectName: string; projectCode: string }>[] = [
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
      header: 'Risk Description',
      render: (r) => <span className="text-sm text-slate-700 truncate block max-w-xs" title={r.description}>{r.description}</span>,
      sortable: true
    },
    {
      key: 'category',
      header: 'Category',
      render: (r) => <span className="text-sm text-slate-600">{r.category}</span>,
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
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant="neutral">{r.status}</Badge>,
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
      <PageHeader 
        title="Enterprise Risk Register" 
        subtitle="Centralized view of all project and portfolio risks."
        icon={ShieldAlert}
      />

      <div className={theme.layout.panelContainer}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4`}>
           <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Input 
                isSearch 
                placeholder="Search by risk, project, or owner..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
              />
              <Button variant="secondary" size="md" icon={Filter} className="w-full sm:w-auto">Filter</Button>
           </div>
           <div className="text-sm text-slate-500 w-full sm:w-auto text-left sm:text-right">
              Total Exposure: <span className="font-bold text-slate-800">{filteredRisks.length}</span> Risks
           </div>
        </div>
        
        <div className="flex-1 overflow-auto p-0">
           <DataTable 
             data={filteredRisks}
             columns={columns}
             keyField="id"
             emptyMessage="No risks found in the enterprise register."
           />
        </div>
      </div>
    </div>
  );
};

export default RiskRegister;
