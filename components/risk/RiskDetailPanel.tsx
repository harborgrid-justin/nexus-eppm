import React, { useState, useEffect } from 'react';
// FIX: Corrected import path
import { Risk, RiskResponseAction, RiskHistoryItem } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Save, AlertTriangle, Activity } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { RiskDetailsTab } from './details/RiskDetailsTab';
import { RiskResponseTab } from './details/RiskResponseTab';
import { RiskHistoryTab } from './details/RiskHistoryTab';
import { AuditTrail } from '../common/AuditTrail';
import { CommentThread } from '../common/CommentThread';

interface RiskDetailPanelProps {
  riskId: string;
  projectId: string;
  onClose: () => void;
}

// FIX: Changed to a named export to resolve module resolution error.
export const RiskDetailPanel: React.FC<RiskDetailPanelProps> = ({ riskId, projectId, onClose }) => {
  const { state, dispatch } = useData();
  const { canEditProject } = usePermissions();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'response' | 'history' | 'activity'>('details');

  const isReadOnly = !canEditProject();

  useEffect(() => {
    const foundRisk = state.risks.find(r => r.id === riskId);
    if (foundRisk) {
      setRisk(JSON.parse(JSON.stringify(foundRisk)));
    }
  }, [riskId, state.risks]);

  const handleSave = () => {
    if (risk) {
      if (!risk.description) { alert("Description is required."); return; }
      
      const score = (risk.probabilityValue || 1) * (risk.impactValue || 1);
      const probMap: Record<number, number> = { 1: 0.1, 2: 0.3, 3: 0.5, 4: 0.7, 5: 0.9 };
      const emv = (risk.financialImpact || 0) * (probMap[risk.probabilityValue] || 0.1);
      
      dispatch({ type: 'UPDATE_RISK', payload: { risk: { ...risk, score, emv } } });
      onClose();
    }
  };

  if (!risk) return null;

  return (
    <SidePanel
      isOpen={true}
      onClose={onClose}
      width="max-w-4xl"
      title={
          <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" />
              <h2 className="text-xl font-bold text-slate-900">{risk.id}</h2>
          </div>
      }
      footer={
        <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            {!isReadOnly && <Button onClick={handleSave} icon={Save}>Save Changes</Button>}
        </>
      }
    >
        <div className="flex border-b border-slate-200">
            {['details', 'response', 'history', 'activity'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
        <div className="pt-6">
            {activeTab === 'details' && <RiskDetailsTab risk={risk} setRisk={setRisk} isReadOnly={isReadOnly} projectId={projectId} />}
            {activeTab === 'response' && <RiskResponseTab risk={risk} setRisk={setRisk} isReadOnly={isReadOnly} />}
            {activeTab === 'history' && <RiskHistoryTab risk={risk} />}
            {activeTab === 'activity' && (
                <div className="space-y-6">
                    <CommentThread />
                    <AuditTrail logs={risk.history || []} />
                </div>
            )}
        </div>
    </SidePanel>
  );
};