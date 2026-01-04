
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
    // Determine if Update or Add
    // Note: Assuming a draft state means it might exist or might be new
    // We check if it exists in store, but the ID generation logic happens in parent (CostChangeOrders.tsx) for new ones.
    // So we just dispatch ADD or UPDATE. Since ID is pre-generated for new, we can check if it exists in state? 
    // Or just rely on a flag. 
    // Simplified: Dispatch UPDATE if it exists in list, else ADD.
    // But since we can't easily check store here without reading state, we can use a heuristic or just dispatch UPDATE 
    // if status is not Draft, or ADD if it is Draft and newly created.
    // Safer: Always dispatch Add/Update action that handles upsert logic, or separate.
    // For now, let's use the assumption that if it came from the list, it exists. If from 'Create', it's new.
    // However, the parent passes the object.
    
    // We will use UPDATE_CHANGE_ORDER for existing items. For new ones, the parent assigned an ID.
    // Let's use a dual-dispatch approach or check ID pattern. 
    // To make it robust, let's look at `co.status`. If it's `Draft` and history is empty, likely new.
    
    // Actually, `financialSlice` handles ADD and UPDATE separately. 
    // We'll trust that if the user is saving, we update the state. If it's not in state, we should ADD.
    // But we don't have access to state.changeOrders here to check existence easily.
    // Let's dispatch `UPDATE_CHANGE_ORDER` and ensure the reducer handles non-existent IDs gracefully?
    // No, standard Redux pattern usually knows. 
    // Let's assume if it has history, it's an update. If not, it's an add?
    
    // Better: dispatch a new `SAVE_CHANGE_ORDER` or just assume update if ID exists (which it always does).
    // The reducer logic for UPDATE iterates. If not found, nothing happens.
    // So we need to know if we should Add.
    // Let's assume if status is 'Draft' and we are "Saving Draft", we dispatch `ADD_CHANGE_ORDER` if not found in list?
    // Let's use `ADD_CHANGE_ORDER` if the parent passed a "new" flag? Parent doesn't pass flag.
    // We will use a safe approach: Dispatch `ADD_CHANGE_ORDER` if we believe it's new.
    // For now, let's dispatch both or use a smart action? No.
    // Let's rely on `co.history.length === 0`.
    
    if (co.history.length === 0) {
         dispatch({ type: 'ADD_CHANGE_ORDER', payload: co });
    } else {
         dispatch({ type: 'UPDATE_CHANGE_ORDER', payload: co });
    }
    
    onClose();
  };

  const handleApprovalAction = (action: 'Approve' | 'Reject') => {
      if (action === 'Approve') {
          dispatch({ type: 'APPROVE_CHANGE_ORDER', payload: { projectId: co.projectId, changeOrderId: co.id } });
      } else {
          // Add reject logic if needed - currently just updates status locally in this scope, need reducer support for Reject
          const rejectedCo = { ...co, status: 'Rejected' as const };
          dispatch({ type: 'UPDATE_CHANGE_ORDER', payload: rejectedCo });
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
