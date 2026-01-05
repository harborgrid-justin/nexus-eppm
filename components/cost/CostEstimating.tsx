
import React, { useState, useEffect, useMemo } from 'react';
import { useWbsManager } from '../../hooks';
import { CostEstimate, CostEstimateItem } from '../../types/index';
import { useData } from '../../context/DataContext';
import { EstimateWorksheet } from './estimating/EstimateWorksheet';
import { EstimateAnalysis } from './estimating/EstimateAnalysis';
import { CostItemLookup } from './estimating/CostItemLookup';
import { useTheme } from '../../context/ThemeContext';
import { WbsTree } from './estimating/WbsTree';
import { EstimateHeader } from './estimating/EstimateHeader';
import { BasisOfEstimate } from './estimating/BasisOfEstimate';
import { Calculator } from 'lucide-react';
import { ESTIMATE_CLASSES } from '../../constants/index';
import { generateId } from '../../utils/formatters';

interface CostEstimatingProps {
  projectId: string;
}

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
    
    if (existing) {
        setEstimate({ ...existing });
    } else if (selectedNode) {
        // Initialize blank estimate for selected node if none exists
        setEstimate({
            id: generateId('CE'),
            projectId,
            wbsId: selectedNode.id,
            version: 1,
            status: 'Draft',
            method: 'Deterministic',
            class: 'Class 5 (ROM)',
            baseCost: 0,
            contingencyPercent: 10,
            escalationPercent: 0,
            totalCost: 0,
            items: [],
            basisOfEstimate: '',
            updatedAt: new Date().toISOString(),
            updaterId: 'CurrentUser'
        });
    } else {
        setEstimate(null);
    }
  }, [selectedNode, state.projects, projectId]);

  // Recalculate totals whenever items change
  useEffect(() => {
    if (estimate) {
        const baseCost = estimate.items.reduce((sum, item) => sum + item.total, 0);
        const contingency = baseCost * (estimate.contingencyPercent / 100);
        const escalation = baseCost * (estimate.escalationPercent / 100);
        const totalCost = baseCost + contingency + escalation;
        
        if (baseCost !== estimate.baseCost || totalCost !== estimate.totalCost) {
            setEstimate(prev => prev ? { ...prev, baseCost, totalCost } : null);
        }
    }
  }, [estimate?.items, estimate?.contingencyPercent, estimate?.escalationPercent]);

  const handleSave = () => {
      if (estimate) {
          dispatch({ type: 'COST_ESTIMATE_ADD_OR_UPDATE', payload: { projectId, estimate } });
      }
  };

  const handleAddCustomItem = () => {
      if (!estimate) return;
      const newItem: CostEstimateItem = {
          id: generateId('EI'),
          description: 'New Item',
          resourceType: 'Material',
          quantity: 1,
          uom: 'EA',
          unitRate: 0,
          total: 0
      };
      setEstimate({ ...estimate, items: [...estimate.items, newItem] });
  };

  const handleLookupItem = (costBookItem: any) => {
      if (!estimate) return;
      const newItem: CostEstimateItem = {
          id: generateId('EI'),
          description: costBookItem.description,
          resourceType: costBookItem.type,
          quantity: 1,
          uom: costBookItem.unit,
          unitRate: costBookItem.rate,
          total: costBookItem.rate // qty 1
      };
      setEstimate({ ...estimate, items: [...estimate.items, newItem] });
      setIsLookupOpen(false);
  };

  const handleUpdateItem = (id: string, field: keyof CostEstimateItem, value: any) => {
      if (!estimate) return;
      const updatedItems = estimate.items.map(item => {
          if (item.id === id) {
              const updatedItem = { ...item, [field]: value };
              // Recalc total if drivers change
              if (field === 'quantity' || field === 'unitRate') {
                  updatedItem.total = updatedItem.quantity * updatedItem.unitRate;
              } else if (field === 'optimistic' || field === 'mostLikely' || field === 'pessimistic') {
                  // PERT Calculation: (O + 4M + P) / 6
                  const o = updatedItem.optimistic || 0;
                  const m = updatedItem.mostLikely || 0;
                  const p = updatedItem.pessimistic || 0;
                  // Only update total if in Three-Point mode (handled by render logic usually, but enforcing here)
                  if (estimate.method === 'Three-Point') {
                      updatedItem.total = (o + 4 * m + p) / 6 * updatedItem.quantity;
                  }
              }
              return updatedItem;
          }
          return item;
      });
      setEstimate({ ...estimate, items: updatedItems });
  };

  const handleDeleteItem = (id: string) => {
      if (!estimate) return;
      setEstimate({ ...estimate, items: estimate.items.filter(i => i.id !== id) });
  };

  const chartData = useMemo(() => {
      if (!estimate) return [];
      const buckets: Record<string, number> = {};
      estimate.items.forEach(i => { buckets[i.resourceType] = (buckets[i.resourceType] || 0) + i.total; });
      return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [estimate]);

  return (
    <div className={`h-full flex flex-col md:flex-row overflow-hidden ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm relative`}>
      <CostItemLookup isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} onAddItem={handleLookupItem} />
      <WbsTree wbsTree={wbsTree} selectedNode={selectedNode} onNodeClick={handleNodeClick} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {estimate && selectedNode ? (
          <>
            <EstimateHeader estimate={estimate} wbsNode={selectedNode} onSave={handleSave} onTabChange={setActiveTab} activeTab={activeTab} />
            <div className={`flex-1 overflow-y-auto p-6 ${theme.colors.background}/30`}>
                {activeTab === 'worksheet' && (
                    <EstimateWorksheet 
                        estimate={estimate} 
                        setEstimate={setEstimate} 
                        onOpenLookup={() => setIsLookupOpen(true)} 
                        onAddCustom={handleAddCustomItem}
                        onUpdateItem={handleUpdateItem}
                        onDeleteItem={handleDeleteItem}
                    />
                )}
                {activeTab === 'analysis' && <EstimateAnalysis estimate={estimate} chartData={chartData} colors={COLORS} estimateClasses={ESTIMATE_CLASSES} />}
                {activeTab === 'boe' && <BasisOfEstimate estimate={estimate} setEstimate={setEstimate} />}
            </div>
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${theme.colors.text.tertiary} ${theme.colors.background}/50`}>
            <Calculator size={48} className="mb-4 opacity-50"/>
            <p>Select a WBS element to view or create an estimate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimating;
