
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { Plus, Filter } from 'lucide-react';
import RiskDetailModal from './RiskDetailModal';
import { useTheme } from '../../context/ThemeContext';
import { Risk } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

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

  return (
    <div className="h-full flex flex-col">
      {selectedRiskId && <RiskDetailModal riskId={selectedRiskId} projectId={projectId} onClose={() => setSelectedRiskId(null)} />}
      
      <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50/50 flex-shrink-0`}>
        <div className="flex items-center gap-2">
          <Input 
            isSearch 
            placeholder="Search risks..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-64"
          />
          <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>Add Risk</Button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className={`${theme.colors.background} sticky top-0`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
            </tr>
          </thead>
          <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
            {filteredRisks.map((risk: Risk) => (
              <tr key={risk.id} onClick={() => setSelectedRiskId(risk.id)} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{risk.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 max-w-md truncate">{risk.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{risk.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Badge variant={getScoreVariant(risk.score)}>
                    {risk.score}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{risk.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{risk.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskRegisterGrid;
