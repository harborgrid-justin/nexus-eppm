
import React from 'react';
import { Risk } from '../../../types';
import DataTable, { Column } from '../../common/DataTable';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';

interface RiskListViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskListView: React.FC<RiskListViewProps> = ({ risks, onSelectRisk }) => {
  
  const getScoreVariant = (score: number) => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  const columns: Column<Risk & { projectName?: string, projectCode?: string }>[] = [
    { key: 'id', header: 'Risk ID', width: 'w-24', render: (r) => <span className="font-mono text-xs text-slate-500">{r.id}</span>, sortable: true },
    { key: 'projectName', header: 'Project Context', render: (r) => (<div><div className="text-sm font-medium text-slate-900">{r.projectName}</div><div className="text-xs text-slate-500 font-mono">{r.projectCode}</div></div>), sortable: true },
    { key: 'description', header: 'Description', render: (r) => (<div><span className="text-sm text-slate-700 truncate block max-w-xs" title={r.description}>{r.description}</span>{r.isEscalated && <span className="text-[10px] text-red-600 font-bold"> Escalated</span>}</div>), sortable: true },
    { key: 'score', header: 'Score', align: 'center', render: (r) => <Badge variant={getScoreVariant(r.score)}>{r.score}</Badge>, sortable: true },
    { key: 'emv', header: 'Exposure (EMV)', align: 'right', render: (r) => <span className="font-mono text-sm">{formatCompactCurrency(r.emv || 0)}</span>, sortable: true },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Closed' ? 'neutral' : r.status === 'Open' ? 'warning' : 'success'}>{r.status}</Badge>, sortable: true },
    { key: 'owner', header: 'Owner', render: (r) => <span className="text-sm text-slate-600">{r.ownerId}</span>, sortable: true }
  ];

  return <DataTable data={risks} columns={columns} keyField="id" onRowClick={(r) => onSelectRisk(r.id)} emptyMessage="No risks match your criteria." />;
};
