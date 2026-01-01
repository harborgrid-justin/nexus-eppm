
import React, { useState, useEffect, useMemo } from 'react';
import { useWbsManager } from '../../hooks';
import { CostEstimate } from '../../types/index';
import { useData } from '../../context/DataContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { EstimateWorksheet } from './estimating/EstimateWorksheet';
import { EstimateAnalysis } from './estimating/EstimateAnalysis';
import { CostItemLookup } from './estimating/CostItemLookup';
import { useTheme } from '../../context/ThemeContext';
import { WbsTree } from './estimating/WbsTree';
import { EstimateHeader } from './estimating/EstimateHeader';
import { BasisOfEstimate } from './estimating/BasisOfEstimate';
import { Calculator } from 'lucide-react';

interface CostEstimatingProps {
  projectId: string;
}

export const ESTIMATE_CLASSES = [
    { id: 'Class 5 (ROM)', accuracy: '-50% to +100%' }, { id: 'Class 4 (Preliminary)', accuracy: '-30% to +50%' },
    { id: 'Class 3 (Budget)', accuracy: '-20% to +30%' }, { id: 'Class 2 (Control)', accuracy: '-15% to +20%' },
    { id: 'Class 1 (Definitive)', accuracy: '-10% to +15%' },
];
const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const CostEstimating: React.FC<CostEstimatingProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { wbsTree, selectedNode, handleNodeClick } = useWbsManager(projectId);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [activeTab, setActiveTab] = useState<'worksheet' | 'analysis' | 'boe'>('worksheet');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  useEffect(() => {
    const project = state.projects.find(p => p.id === projectId);
    const existing = project?.costEstimates?.find(e => e.wbsId === selectedNode?.id);
    setEstimate(existing ? { ...existing } : null);
  }, [selectedNode, state.projects, projectId]);

  const handleSave = () => {
      if (estimate) {
          dispatch({ type: 'COST_ESTIMATE_ADD_OR_UPDATE', payload: { projectId, estimate } });
          alert('Estimate Saved');
      }
  };

  const chartData = useMemo(() => {
      if (!estimate) return [];
      const buckets: Record<string, number> = {};
      estimate.items.forEach(i => { buckets[i.resourceType] = (buckets[i.resourceType] || 0) + i.total; });
      return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [estimate]);

  return (
    <div className={`h-full flex flex-col md:flex-row overflow-hidden ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm relative`}>
      <CostItemLookup isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} onAddItem={() => {}} />
      <WbsTree wbsTree={wbsTree} selectedNode={selectedNode} onNodeClick={handleNodeClick} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {estimate && selectedNode ? (
          <>
            <EstimateHeader estimate={estimate} wbsNode={selectedNode} onSave={handleSave} onTabChange={setActiveTab} activeTab={activeTab} />
            <div className={`flex-1 overflow-y-auto p-6 ${theme.colors.background}/30`}>
                {activeTab === 'worksheet' && <EstimateWorksheet estimate={estimate} setEstimate={setEstimate} onOpenLookup={() => setIsLookupOpen(true)} onAddCustom={()=>{}} onUpdateItem={()=>{}} onDeleteItem={()=>{}} />}
                {activeTab === 'analysis' && <EstimateAnalysis estimate={estimate} chartData={chartData} colors={COLORS} estimateClasses={ESTIMATE_CLASSES} />}
                {activeTab === 'boe' && <BasisOfEstimate estimate={estimate} setEstimate={setEstimate} />}
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${theme.colors.text.tertiary} ${theme.colors.background}/50`}>
            <Calculator size={48} className="mb-4 opacity-50"/><p>Select a WBS element to view or create an estimate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimating;
