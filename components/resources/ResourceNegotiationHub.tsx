
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Users, ArrowRight, XCircle, AlertCircle, TrendingUp, UserCheck, Clock, Plus, Inbox, ShieldAlert, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useResourceNegotiationLogic } from '../../hooks/domain/useResourceNegotiationLogic';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { EmptyGrid } from '../common/EmptyGrid';

const ResourceNegotiationHub: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const { 
        requests,
        selectedReqId,
        setSelectedReqId,
        viewMode,
        setViewMode,
        selectedReq,
        impactData,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleUpdateStatus,
        handleCreateRequest
    } = useResourceNegotiationLogic();

    const [newRequestData, setNewRequestData] = useState({
        projectId: state.projects[0]?.id || '',
        role: '',
        quantity: 1,
        startDate: '',
        notes: ''
    });

    const hasActiveProjects = state.projects.length > 0;

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Resource Negotiation Hub</h2>
                    <p className={theme.typography.small}>Allocation balancing and request fulfillment.</p>
                </div>
                <div className="flex gap-3">
                    <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
                        <button 
                            onClick={() => setViewMode('manager')}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'manager' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
                        >
                            Incoming Requests
                        </button>
                        <button 
                            onClick={() => setViewMode('requester')}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'requester' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary} hover:${theme.colors.text.primary}`}`}
                        >
                            My Demands
                        </button>
                    </div>
                    {hasActiveProjects && (
                        <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Submit Demand</Button>
                    )}
                </div>
            </div>

            {requests.length === 0 ? (
                <EmptyGrid 
                    title={viewMode === 'manager' ? "No Inbound Requests" : "No active resource requests."}
                    description={viewMode === 'manager' 
                        ? "The resource queue is clear. No allocation approvals are required at this time." 
                        : "Submit a new demand signal for any active project to begin the negotiation process."
                    }
                    onAdd={hasActiveProjects ? () => setIsCreateModalOpen(true) : undefined}
                    actionLabel="Submit Demand Signal"
                    icon={Inbox}
                />
            ) : (
                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* List Column */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin">
                        {requests.map(req => (
                            <Card 
                                key={req.id} 
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedReqId === req.id ? 'border-nexus-500 ring-1 ring-nexus-500/20' : 'border-transparent hover:border-slate-300'}`}
                                onClick={() => setSelectedReqId(req.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'neutral'}>
                                            {req.status}
                                        </Badge>
                                        <span className="text-xs font-mono text-slate-400">{req.id}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${theme.colors.text.secondary}`}>{req.startDate} <ArrowRight size={12} className="inline mx-1"/> {req.endDate}</span>
                                </div>
                                <h4 className={`font-bold ${theme.colors.text.primary} text-lg mb-1`}>{req.role} <span className="text-slate-400 font-normal">x{req.quantity}</span></h4>
                                <div className="flex justify-between items-center mt-3">
                                    <div className={`text-sm ${theme.colors.text.secondary} flex items-center gap-2`}>
                                        <Target size={14} className="text-nexus-600"/>
                                        for <strong>{req.projectName}</strong>
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${theme.colors.text.secondary}`}>
                                        <div className={`w-6 h-6 rounded-full ${theme.colors.background} flex items-center justify-center font-bold text-slate-500 border ${theme.colors.border}`}>
                                            {req.requesterName.charAt(0)}
                                        </div>
                                        {req.requesterName}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Impact Analysis Column */}
                    <div className="w-[450px] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                        {selectedReq ? (
                            <>
                                <Card className={`p-6 ${theme.colors.background} ${theme.colors.border}`}>
                                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                                        <TrendingUp size={18} className="text-nexus-600"/> Impact Analysis
                                    </h3>
                                    
                                    {impactData && (
                                        <div className="space-y-6">
                                            <div>
                                                <div className={`flex justify-between text-xs font-bold ${theme.colors.text.secondary} uppercase mb-2`}>
                                                    <span>Current Resource Load</span>
                                                    <span>{impactData.currentUtilization}%</span>
                                                </div>
                                                <ProgressBar value={impactData.currentUtilization} colorClass="bg-blue-500" />
                                            </div>
                                            
                                            <div>
                                                <div className={`flex justify-between text-xs font-bold ${theme.colors.text.secondary} uppercase mb-2`}>
                                                    <span>Projected Load (+Request)</span>
                                                    <span className={impactData.newUtilization > 100 ? 'text-red-600' : 'text-nexus-600'}>{impactData.newUtilization}%</span>
                                                </div>
                                                <ProgressBar value={impactData.newUtilization} thresholds />
                                                {impactData.newUtilization > 100 && (
                                                    <div className={`mt-2 p-2 ${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.border} ${theme.colors.semantic.danger.text} text-xs rounded flex items-center gap-2`}>
                                                        <AlertCircle size={14}/> <strong>Conflict Detected:</strong> Threshold exceeded.
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${theme.colors.border}`}>
                                                <div className={`text-center p-3 ${theme.colors.surface} rounded-lg border ${theme.colors.border}`}>
                                                    <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase font-bold`}>Available Pool</p>
                                                    <p className={`text-2xl font-black ${theme.colors.text.primary}`}>{impactData.roleCount}</p>
                                                </div>
                                                <div className={`text-center p-3 ${theme.colors.surface} rounded-lg border ${theme.colors.border}`}>
                                                    <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase font-bold`}>Free Status</p>
                                                    <p className="text-2xl font-black text-green-600">{impactData.available}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                <div className="space-y-3">
                                    <Button 
                                        className="w-full justify-center" 
                                        icon={UserCheck} 
                                        disabled={selectedReq.status === 'Approved'}
                                        onClick={() => handleUpdateStatus('Approved')}
                                    >
                                        Approve Allocation
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button 
                                            variant="secondary" 
                                            className="w-full justify-center" 
                                            icon={Clock}
                                            onClick={() => handleUpdateStatus('Soft Booked')}
                                            disabled={selectedReq.status === 'Soft Booked'}
                                        >
                                            Soft Book
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            className="w-full justify-center" 
                                            icon={XCircle}
                                            onClick={() => handleUpdateStatus('Rejected')}
                                            disabled={selectedReq.status === 'Rejected'}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={`flex-1 flex flex-col items-center justify-center ${theme.colors.text.tertiary} nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-xl`}>
                                <ShieldAlert size={48} className="mb-4 opacity-20"/>
                                <p className="font-bold">Select a request to view impact analysis.</p>
                                <p className="text-xs mt-1">Detailed capacity deltas are calculated on-the-fly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Request Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="New Demand Signal"
                footer={<Button onClick={() => handleCreateRequest(newRequestData)}>Submit Request</Button>}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Target Project</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={newRequestData.projectId}
                            onChange={e => setNewRequestData({...newRequestData, projectId: e.target.value})}
                        >
                            {state.projects.map(p => <option key={p.id} value={p.id}>{p.code}: {p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Required Role</label>
                        <Input 
                            value={newRequestData.role} 
                            onChange={e => setNewRequestData({...newRequestData, role: e.target.value})}
                            placeholder="e.g. Senior Structural Engineer"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Quantity" type="number" 
                            value={newRequestData.quantity}
                            onChange={e => setNewRequestData({...newRequestData, quantity: parseInt(e.target.value)})}
                        />
                        <Input 
                            label="Start Date" type="date"
                            value={newRequestData.startDate}
                            onChange={e => setNewRequestData({...newRequestData, startDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Allocated Rational</label>
                        <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none"
                            value={newRequestData.notes}
                            onChange={e => setNewRequestData({...newRequestData, notes: e.target.value})}
                            placeholder="Explain why these resources are critical for the project schedule..."
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ResourceNegotiationHub;
