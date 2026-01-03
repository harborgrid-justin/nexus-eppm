
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
  const [filters, setFilters] = useState({ category: 'All', minScore: 0, owner: 'All' });

  // Helper to enrich risk data with project context
  const enrichRiskData = (risk: Risk) => {
    const project = state.projects.find(p => p.id === risk.projectId);
    const probPercent = risk.probabilityValue ? risk.probabilityValue * 0.2 : 0.5;
    const financial = risk.financialImpact || 50000; 
    return { 
        ...risk, 
        projectName: project ? project.name : 'Unknown', 
        projectCode: project ? project.code : 'N/A', 
        financialImpact: financial, 
        emv: financial * probPercent 
    };
  };

  const enterpriseRisks = useMemo(() => 
    state.risks.map(enrichRiskData), 
  [state.risks, state.projects]);
  
  const filteredRisks = useMemo(() => enterpriseRisks.filter(r => 
      (r.description.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || r.projectName.toLowerCase().includes(deferredSearchTerm.toLowerCase())) &&
      (filters.category === 'All' || r.category === filters.category) &&
      (r.score >= filters.minScore) &&
      (filters.owner === 'All' || r.ownerId === filters.owner)
  ), [enterpriseRisks, deferredSearchTerm, filters]);

  const metrics = useMemo(() => ({
    totalExposure: filteredRisks.reduce((sum, r) => sum + r.emv, 0),
    activeCount: filteredRisks.length,
    criticalCount: filteredRisks.filter(r => r.score >= 15).length,
    escalatedCount: filteredRisks.filter(r => r.isEscalated).length
  }), [filteredRisks]);

  const handleViewChange = (mode: 'list' | 'matrix' | 'analytics') => {
      startTransition(() => {
          setViewMode(mode);
      });
  };

  return {
      // State
      viewMode,
      searchTerm,
      deferredSearchTerm,
      selectedRiskId,
      filters,
      isPending,
      
      // Data
      filteredRisks,
      metrics,
      
      // Actions
      setSearchTerm,
      setFilters,
      setSelectedRiskId,
      handleViewChange
  };
};
