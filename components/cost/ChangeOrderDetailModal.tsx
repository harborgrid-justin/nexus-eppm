
import React, { useState } from 'react';
// FIX: Corrected import path to avoid module resolution conflict.
import { ChangeOrder, ChangeOrderHistoryItem } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Save, CheckCircle, FileText, AlertTriangle, GitPullRequest } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { ChangeOrderDetails } from './change_order/ChangeOrderDetails';
import { ChangeOrderImpact } from './change_order/ChangeOrderImpact';
import { ChangeOrderWorkflow } from './change_order/ChangeOrderWorkflow';

interface ChangeOrderDetailModalProps {
  changeOrder: ChangeOrder;
  onClose: () => void;
}

const ChangeOrderDetailModal: React.FC<ChangeOrderDetailModalProps> = ({ changeOrder: initialCo, onClose }) => {
  const { dispatch } = useData();
  const { hasPermission, user } = usePermissions();
  const [co, setCo] = useState<ChangeOrder>(initialCo);
  const [activeTab, setActiveTab] = useState<'details' | 'impact' | 'workflow'>('details');

  const isReadOnly = co.status !== 'Draft' && !hasPermission('financials:approve');
  const canApprove = hasPermission('financials:approve') && co.status === 'Pending Approval';

  const handleChange = (field: keyof ChangeOrder, value: any) => setCo(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    // In a real app, dispatch an update action
    alert('Change Order Saved (Simulation)');
    onClose();
  };

  const handleApprovalAction = (action: 'Approve' | 'Reject') => {
      if (action === 'Approve') {
          dispatch({ type: 'APPROVE_CHANGE_ORDER', payload: { projectId: co.projectId, changeOrderId: co.id } });
      } else {
          // Add reject logic if needed
      }
      onClose();
  };

  const renderTabs = () => (
    <div className="flex border-b border-slate-200">
      {[ { id: 'details', label: 'Details', icon: FileText }, { id: 'impact', label: 'Impact Analysis', icon: AlertTriangle }, { id: 'workflow', label: 'Workflow', icon: GitPullRequest } ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <tab.icon size={14}/> {tab.label}
          </button>
      ))}
    </div>
  );

  return (
    <SidePanel isOpen={true} onClose={onClose} width="md:w-[800px]"
       title={
         <div>
            <h2 className="text-xl font-bold text-slate-900">{co.title}</h2>
            <div className="text-xs text-slate-500">ID: <span className="font-mono">{co.id}</span></div>
         </div>
       }
       footer={
         <>
             <Button variant="secondary" onClick={onClose}>Close</Button>
             {!isReadOnly && <Button onClick={handleSave} icon={Save}>Save Draft</Button>}
             {canApprove && (
                 <>
                     <Button variant="danger" onClick={() => handleApprovalAction('Reject')}>Reject</Button>
                     <Button variant="primary" onClick={() => handleApprovalAction('Approve')} icon={CheckCircle}>Approve</Button>
                 </>
             )}
         </>
       }
    >
       <div className="space-y-6">
          {renderTabs()}
          <div className="pt-6">
             {activeTab === 'details' && <ChangeOrderDetails co={co} isReadOnly={isReadOnly} onChange={handleChange} />}
             {activeTab === 'impact' && <ChangeOrderImpact co={co} isReadOnly={isReadOnly} onChange={handleChange} />}
             {activeTab === 'workflow' && <ChangeOrderWorkflow co={co} />}
          </div>
       </div>
    </SidePanel>
  );
};

export default ChangeOrderDetailModal;