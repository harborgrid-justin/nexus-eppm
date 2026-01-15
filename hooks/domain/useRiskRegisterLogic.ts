
import { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { Risk } from '../../types';

export const useRiskRegisterLogic = () => {
  const { state } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'analytics'>('list');
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const enterpriseRisks = useMemo(() => {
    return state.risks.map(risk => {
        const project = state.projects.find(p => p.id === risk.projectId);
        // Default probability factor if not set
        const probFactor = [0, 0.1, 0.3, 0.5, 0.7, 0.9][risk.probabilityValue || 3];
        return { 
            ...risk, 
            projectName: project ? project.name : 'Enterprise Level', 
            emv: (risk.financialImpact || 0) * probFactor 
        };
    });
  }, [state.risks, state.projects]);
  
  const filteredRisks = useMemo(() => enterpriseRisks.filter(r => 
      r.description.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
      r.projectName.toLowerCase().includes(deferredSearchTerm.toLowerCase())
  ), [enterpriseRisks, deferredSearchTerm]);

  const metrics = useMemo(() => ({
    totalExposure: filteredRisks.reduce((sum, r) => sum + (r.emv || 0), 0),
    activeCount: filteredRisks.filter(r => r.status === 'Open').length,
    criticalCount: filteredRisks.filter(r => r.score >= 15).length,
    escalatedCount: filteredRisks.filter(r => r.isEscalated).length
  }), [filteredRisks]);

  const handleViewChange = (mode: 'list' | 'matrix' | 'analytics') => {
      startTransition(() => setViewMode(mode));
  };

  return {
      viewMode, searchTerm, deferredSearchTerm, selectedRiskId, isPending,
      filteredRisks, metrics, setSearchTerm, setSelectedRiskId, handleViewChange
  };
};
