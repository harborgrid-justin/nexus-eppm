
import React, { useState } from 'react';
import { ChangeOrder, ChangeOrderHistoryItem } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Save, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, FileText, GitPullRequest, ArrowRight, User } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { formatCurrency } from '../../utils/formatters';

interface ChangeOrderDetailModalProps {
  changeOrder: ChangeOrder;
  onClose: () => void;
}

const ChangeOrderDetailModal: React.FC<ChangeOrderDetailModalProps> = ({ changeOrder: initialCo, onClose }) => {
  const { dispatch } = useData();
  const { hasPermission, user } = usePermissions();
  const [co, setCo] = useState<ChangeOrder>(initialCo);
  const [activeTab, setActiveTab] = useState<'details' | 'impact' | 'workflow'>('details');

  const isReadOnly = co.status === 'Approved' || co.status === 'Rejected' || !hasPermission('financials:write');
  const canApprove = hasPermission('financials:approve') && co.status === 'Pending Approval';

  const handleChange = (field: keyof ChangeOrder, value: any) => {
    setCo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In a real app, this would dispatch an update action
    alert('Change Order Saved (Simulation)');
    onClose();
  };

  const handleApprovalAction = (action: 'Approve' | 'Reject') => {
      const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';
      const historyItem: ChangeOrderHistoryItem = {
          date: new Date().toISOString().split('T')[0],
          user: user?.name || 'Unknown',
          action: `${action}d by CCB`,
          comment: action === 'Approve' ? 'Approved based on business case.' : 'Rejected due to budget constraints.'
      };
      
      const updatedCo = {
          ...co,
          status: newStatus,
          history: [...(co.history || []), historyItem]
      };

      // If approved, trigger the domain logic (simulated here via dispatch if we had a specific update action)
      if (action === 'Approve') {
          dispatch({ type: 'APPROVE_CHANGE_ORDER', payload: { projectId: co.projectId, changeOrderId: co.id } });
      } else {
          // For rejection, we'd just update the record
          // dispatch({ type: 'UPDATE_CHANGE_ORDER', payload: updatedCo });
      }
      onClose();
  };

  const steps = ['Initiation', 'Technical Review', 'CCB Review', 'Execution'];
  const currentStepIdx = steps.indexOf(co.stage || 'Initiation');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">{co.title}</h2>
                    <span className="font-mono text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">{co.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        co.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        co.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        co.status === 'Pending Approval' ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                        {co.status}
                    </span>
                </div>
                <div className="text-xs text-slate-500 flex gap-4">
                    <span>Submitted by: <strong>{co.submittedBy}</strong></span>
                    <span>Date: <strong>{co.dateSubmitted}</strong></span>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          {/* Workflow Stepper */}
          <div className="px-8 py-6 bg-white border-b border-slate-100">
              <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10"></div>
                  {steps.map((step, idx) => {
                      const isComplete = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                          <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                                  isComplete ? 'bg-nexus-600 border-nexus-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                              }`}>
                                  {isComplete ? <CheckCircle size={14}/> : idx + 1}
                              </div>
                              <span className={`text-xs font-medium ${isCurrent ? 'text-nexus-700' : 'text-slate-500'}`}>{step}</span>
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-6">
              {[
                  { id: 'details', label: 'General Details', icon: FileText },
                  { id: 'impact', label: 'Impact Analysis', icon: AlertTriangle },
                  { id: 'workflow', label: 'History & Workflow', icon: GitPullRequest }
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === tab.id 
                        ? 'border-nexus-600 text-nexus-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                      <tab.icon size={14}/> {tab.label}
                  </button>
              ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
             {activeTab === 'details' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description of Change</label>
                            <textarea 
                                value={co.description}
                                disabled={isReadOnly}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:ring-nexus-500"
                            />
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm">Classification</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Category</label>
                                    <select 
                                        value={co.category || 'Client Request'} 
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        disabled={isReadOnly}
                                        className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                    >
                                        <option>Client Request</option>
                                        <option>Design Error</option>
                                        <option>Unforeseen Condition</option>
                                        <option>Regulatory</option>
                                        <option>Value Engineering</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Priority</label>
                                    <div className="flex gap-2">
                                        {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                            <button
                                                key={p}
                                                onClick={() => handleChange('priority', p)}
                                                disabled={isReadOnly}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                                                    co.priority === p 
                                                    ? 'bg-nexus-50 border-nexus-500 text-nexus-700' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm">Justification</h3>
                            <textarea 
                                value={co.justification || ''}
                                onChange={(e) => handleChange('justification', e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Reason for change..."
                                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 resize-none"
                            />
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'impact' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <DollarSign className="text-green-600" size={18}/> Cost Impact
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Net Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input 
                                            type="number" 
                                            value={co.amount}
                                            onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                                            disabled={isReadOnly}
                                            className="w-full pl-7 p-2 border border-slate-300 rounded-md text-lg font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg max-w-[150px]">
                                    This represents {(co.amount / 5000000 * 100).toFixed(2)}% of the original budget.
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Calendar className="text-blue-600" size={18}/> Schedule Impact
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Time Extension</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={co.scheduleImpactDays || 0}
                                            onChange={(e) => handleChange('scheduleImpactDays', parseFloat(e.target.value))}
                                            disabled={isReadOnly}
                                            className="w-full p-2 border border-slate-300 rounded-md text-lg font-bold text-slate-900"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Days</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg text-xs font-bold border border-orange-100">
                                    <AlertTriangle size={14}/> Critical Path
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                         <h4 className="text-sm font-bold text-slate-800 mb-2">Scope Impact Statement</h4>
                         <textarea 
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm h-24"
                            placeholder="Describe impact on deliverables, quality, or safety..."
                            disabled={isReadOnly}
                         />
                     </div>
                 </div>
             )}

             {activeTab === 'workflow' && (
                 <div className="space-y-6">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 mb-4">Approval Chain</h3>
                         <div className="space-y-4">
                             {['Project Manager', 'Finance Controller', 'Program Sponsor'].map((role, i) => (
                                 <div key={role} className="flex items-center gap-4">
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i===0 ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-300'}`}>
                                         {i === 0 ? <CheckCircle size={16}/> : i+1}
                                     </div>
                                     <div className="flex-1">
                                         <p className="text-sm font-bold text-slate-800">{role}</p>
                                         <p className="text-xs text-slate-500">{i===0 ? 'Approved on Oct 12' : 'Pending Review'}</p>
                                     </div>
                                     {i === 0 && <span className="text-xs font-mono text-slate-400">Sarah Chen</span>}
                                 </div>
                             ))}
                         </div>
                     </div>

                     <div className="space-y-2">
                         <h3 className="font-bold text-slate-800 text-sm">Audit Log</h3>
                         {(co.history || []).map((item, idx) => (
                             <div key={idx} className="flex gap-3 text-sm p-2 hover:bg-slate-50 rounded">
                                 <div className="mt-1"><Clock size={14} className="text-slate-400"/></div>
                                 <div>
                                     <p className="text-slate-800"><span className="font-bold">{item.user}</span> {item.action}</p>
                                     <p className="text-xs text-slate-500">{item.date}</p>
                                     {item.comment && <p className="text-xs text-slate-600 italic mt-1">"{item.comment}"</p>}
                                 </div>
                             </div>
                         ))}
                         {(!co.history || co.history.length === 0) && <p className="text-slate-400 text-xs italic">No history available.</p>}
                     </div>
                 </div>
             )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
             <div className="text-xs text-slate-500">
                Total Impact: <span className="font-bold text-slate-700">{formatCurrency(co.amount)}</span> / <span className="font-bold text-slate-700">{co.scheduleImpactDays || 0} days</span>
             </div>
             <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Close</button>
                {!isReadOnly && <button onClick={handleSave} className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm flex items-center gap-2"><Save size={16}/> Save Draft</button>}
                {canApprove && (
                    <>
                        <button onClick={() => handleApprovalAction('Reject')} className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 shadow-sm">Reject</button>
                        <button onClick={() => handleApprovalAction('Approve')} className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 shadow-sm flex items-center gap-2"><CheckCircle size={16}/> Approve</button>
                    </>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ChangeOrderDetailModal;
