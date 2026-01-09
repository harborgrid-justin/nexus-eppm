
import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Plus, Filter, Download } from 'lucide-react';
import { RiskDetailPanel as RiskDetailModal } from './RiskDetailPanel'; 
import { useTheme } from '../../context/ThemeContext';
import { Risk } from '../../types/index';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import DataTable, { Column } from '../common/DataTable';
import { RiskForm } from './RiskForm';
import { useData } from '../../context/DataContext';
import { ExportService } from '../../services/ExportService';

export const RiskRegisterGrid: React.FC = () => {
  const { project, risks } = useProjectWorkspace();
  const projectId = project.id;
  const { state, dispatch } = useData();
  const theme = useTheme();

  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [riskToEdit, setRiskToEdit] = useState<Risk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getResourceName = (id: string) => {
    return state.resources.find(r => r.id === id)?.name || 'Unknown';
  };

  const getScoreVariant = (score: number): 'danger' | 'warning' | 'success' => {
    if (score >= 15) return 'danger';
    if (score >= 8) return 'warning';
    return 'success';
  };

  const filteredRisks = useMemo(() => {
    const list = risks || [];
    if (!searchTerm) return list;
    return list.filter(r => 
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getResourceName(r.ownerId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [risks, searchTerm, state.resources]);

  const handleCreate = () => {
    setRiskToEdit(null);
    setIsFormOpen(true);
  };

  const handleSaveRisk = (risk: Risk) => {
    if (riskToEdit) {
         dispatch({ type: 'UPDATE_RISK', payload: { risk } });
    } else {
         dispatch({ type: 'ADD_RISK', payload: risk });
    }
  };

  const handleExport = async () => {
      await ExportService.exportData(filteredRisks, `project_risks_${projectId}`, 'CSV');
  };

  const columns = useMemo<Column<Risk>[]>(() => [
    {
      key: 'id',
      header: 'ID',
      width: 'w-24',
      render: (risk) => <span className={`font-mono text-xs ${theme.colors.text.tertiary}`}>{risk.id}</span>,
      sortable: true
    },
    {
      key: 'description',
      header: 'Description',
      render: (risk) => <span className={`font-medium ${theme.colors.text.primary} truncate block max-w-md`} title={risk.description}>{risk.description}</span>,
      sortable: true
    },
    {
      key: 'category',
      header: 'Category',
      render: (risk) => <span className={theme.colors.text.secondary}>{risk.category}</span>,
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
      render: (risk) => <span className={`${theme.colors.text.secondary} font-medium text-xs ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border}`}>{risk.status}</span>,
      sortable: true
    },
    {
      key: 'ownerId',
      header: 'Owner',
      render: (risk) => <span className={theme.colors.text.secondary}>{getResourceName(risk.ownerId)}</span>,
      sortable: true
    }
  ], [state.resources, theme]);

  return (
    <div className={`h-full flex flex-col relative ${theme.colors.background}`}>
      <RiskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveRisk}
          projectId={projectId}
          existingRisk={riskToEdit}
      />
      
      {selectedRiskId && (
        <RiskDetailModal 
            riskId={selectedRiskId} 
            projectId={projectId} 
            onClose={() => setSelectedRiskId(null)} 
        />
      )}
      
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center ${theme.colors.surface} flex-shrink-0 gap-3 shadow-sm`}>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Input 
            isSearch 
            placeholder="Search risks..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full sm:w-64"
          />
          <Button variant="secondary" size="md" icon={Download} className="w-full sm:w-auto" onClick={handleExport}>Export</Button>
        </div>
        <Button variant="primary" size="md" icon={Plus} className="w-full sm:w-auto" onClick={handleCreate}>Add Risk</Button>
      </div>

      <div className={`flex-1 overflow-hidden p-4 ${theme.colors.background}`}>
        <DataTable<Risk>
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
