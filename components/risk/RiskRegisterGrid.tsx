
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { Plus, Filter } from 'lucide-react';
import RiskDetailModal from './RiskDetailModal';
import { useTheme } from '../../context/ThemeContext';
import { Risk } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import DataTable, { Column } from '../common/DataTable';

interface RiskRegisterGridProps {
  projectId: string;
}

const RiskRegisterGrid: React.FC<RiskRegisterGridProps> = ({ projectId }) => {
  const { risks } = useProjectState(projectId);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  const getScoreVariant = (score: number): 'danger' | 'warning' | 'success' => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  const filteredRisks = useMemo(() => {
    if (!searchTerm) return risks || [];
    return (risks || []).filter(r => 
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [risks, searchTerm]);

  const columns = useMemo<Column<Risk>[]>(() => [
    {
      key: 'id',
      header: 'ID',
      width: 'w-24',
      render: (risk) => <span className="font-mono text-xs text-slate-500">{risk.id}</span>,
      sortable: true
    },
    {
      key: 'description',
      header: 'Description',
      render: (risk) => <span className="font-medium text-slate-900 truncate block max-w-md" title={risk.description}>{risk.description}</span>,
      sortable: true
    },
    {
      key: 'category',
      header: 'Category',
      render: (risk) => <span className="text-slate-600">{risk.category}</span>,
      sortable: true
    },
    {
      key: 'score',
      header: 'Score',
      align: 'center',
      width: 'w-24',
      render: (risk) => <Badge variant={getScoreVariant(risk.score)}>{risk.score}</Badge>,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (risk) => <span className="text-slate-700 font-medium text-xs bg-slate-100 px-2 py-1 rounded">{risk.status}</span>,
      sortable: true
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (risk) => <span className="text-slate-600">{risk.owner}</span>,
      sortable: true
    }
  ], []);

  return (
    <div className="h-full flex flex-col">
      {selectedRiskId && <RiskDetailModal riskId={selectedRiskId} projectId={projectId} onClose={() => setSelectedRiskId(null)} />}
      
      <div className={`p-4 ${theme.layout.headerBorder} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 flex-shrink-0 gap-3`}>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Input 
            isSearch 
            placeholder="Search risks..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full sm:w-64"
          />
          <Button variant="secondary" size="md" icon={Filter} className="w-full sm:w-auto">Filter</Button>
        </div>
        <Button variant="primary" size="md" icon={Plus} className="w-full sm:w-auto">Add Risk</Button>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <DataTable 
          data={filteredRisks}
          columns={columns}
          onRowClick={(r) => setSelectedRiskId(r.id)}
          keyField="id"
          emptyMessage="No risks found matching criteria."
        />
      </div>
    </div>
  );
};

export default RiskRegisterGrid;
