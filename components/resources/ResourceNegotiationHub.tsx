
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Users, ArrowRight, XCircle, AlertCircle, TrendingUp, Clock, Plus, Inbox, ShieldCheck, Target, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useResourceNegotiationLogic } from '../../hooks/domain/useResourceNegotiationLogic';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { EmptyGrid } from '../common/EmptyGrid';
import { PageLayout } from '../layout/standard/PageLayout';
import { PanelContainer } from '../layout/standard/PanelContainer';

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

    const headerActions = (
        <div className="flex gap-4 items-center">
            <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border} shadow-inner`}>
                <button 
                    onClick={() => setViewMode('manager')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'manager' ? `${theme.colors.surface} shadow-sm text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}
                >
                    Inbound Supply
                </button>
                <button 
                    onClick={() => setViewMode('requester')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'requester' ? `${theme.colors.surface} shadow-sm text-nexus-700` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}
                >
                    Project Demand
                </button>
            </div>
            {hasActiveProjects && (
                <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)} className="shadow-lg shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-9 px-4">Submit Demand</Button>
            )}
        </div>
    );

    return (
        <PageLayout
            title="Resource Negotiation Hub"
            subtitle="Allocation balancing, inter-project trading, and demand signal fulfillment."
            icon={Users}
            actions={headerActions}
        >
            <PanelContainer>
                {requests.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-12">
                        <EmptyGrid 
                            title={viewMode === 'manager' ? "Inbound Queue Clear" : "Demand Registry Neutral"}
                            description={viewMode === 'manager' 
                                ? "No incoming resource allocation requests detected for the current organizational scope." 
                                : "Initialize a new demand signal for your project initiative to begin the capacity negotiation process."
                            }
                            onAdd={hasActiveProjects ? () => setIsCreateModalOpen(true) : undefined}
                            actionLabel="Submit Demand Signal"
                            icon={Inbox}
                        />
                    </div>
                ) : (
                    <div className="flex h-full overflow-hidden">
                        {/* List Column */}
                        <div className={`flex-1 flex flex-col gap-4 overflow-y-auto p-6 border-r ${theme.colors.border} scrollbar-thin`}>
                            {requests.map(req => (
                                <Card 
                                    key={req.id} 
                                    className={`p-5 cursor-pointer transition-all border-l-4 group relative overflow-hidden ${selectedReqId === req.id ? 'border-nexus-600 shadow-md bg-nexus-50/20 ring-1 ring-nexus-500/10' : 'border-transparent hover:border-slate-300 hover:shadow-sm'}`}
                                    onClick={() => setSelectedReqId(req.id)}
                                >
                                    <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'neutral'}>
                                                {req.status}
                                            </Badge>
                                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">{req.id}</span>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${theme.colors.text.tertiary}`}>{req.startDate} <ArrowRight size={10} className="inline mx-1"/> {req.endDate}</span>
                                    </div>
                                    <h4 className={`font-black ${theme.colors.text.primary} text-base mb-2 uppercase tracking-tight`}>{req.role} <span className="text-slate-400 font-bold ml-1">x{req.quantity}</span></h4>
                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 relative z-10">
                                        <div className={`text-xs font-bold ${theme.colors.text.secondary} flex items-center gap-2`}>
                                            <Target size={14} className="text-nexus-600 opacity-60"/>
                                            <span className="uppercase tracking-tight">{req.projectName}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest`}>
                                            <div className={`w-6 h-6 rounded-lg ${theme.colors.background} flex items-center justify-center border ${theme.colors.border} shadow-inner`}>
                                                {req.requesterName.charAt(0)}
                                            </div>
                                            {req.requesterName}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Impact Analysis Column */}
                        <div className="w-[450px] flex flex-col gap-6 p-6 bg-slate-50/50 animate-in slide-in-from-right-6 duration-400">
                            {selectedReq ? (
                                <>
                                    <Card className={`p-6 ${theme.colors.background} border-slate-200 shadow-md relative overflow-hidden`} >
                                        <div className="absolute top-0 right-0 p-24 bg-white/40 rounded-full blur-3xl -mr-12 -mt-12"></div>
                                        <h3 className={`font-black text-slate-900 text-xs uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10`}>
                                            <TrendingUp size={16} className="text-nexus-600"/> Resource Impact Simulation
                                        </h3>
                                        
                                        {impactData && (
                                            <div className="space-y-8 relative z-10">
                                                <div>
                                                    <div className={`flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2`}>
                                                        <span>Current Utilization</span>
                                                        <span className="text-slate-900 font-mono">{impactData.currentUtilization}%</span>
                                                    </div>
                                                    <ProgressBar value={impactData.currentUtilization} colorClass="bg-blue-500" size="sm" />
                                                </div>
                                                
                                                <div>
                                                    <div className={`flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2`}>
                                                        <span>Simulated Load (+{selectedReq.quantity})</span>
                                                        <span className={`font-mono font-black ${impactData.newUtilization > 100 ? 'text-red-600' : 'text-nexus-600'}`}>{impactData.newUtilization}%</span>
                                                    </div>
                                                    <ProgressBar value={impactData.newUtilization} thresholds size="sm" />
                                                    {impactData.newUtilization > 100 && (
                                                        <div className={`mt-4 p-3 ${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.border} ${theme.colors.semantic.danger.text} text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-3 shadow-sm animate-pulse`}>
                                                            <AlertCircle size={14}/> Saturation Exceeded
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={`grid grid-cols-2 gap-4 pt-4 border-t border-slate-200`}>
                                                    <div className={`text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm`}>
                                                        <p className={`text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1`}>FTE Capacity</p>
                                                        <p className={`text-xl font-black text-slate-900 font-mono`}>{impactData.roleCount}</p>
                                                    </div>
                                                    <div className={`text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm`}>
                                                        <p className={`text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1`}>Active Inventory</p>
                                                        <p className="text-xl font-black text-green-600 font-mono">{impactData.available}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>

                                    <div className="space-y-3 pt-2">
                                        <Button 
                                            className="w-full h-12 justify-center font-black uppercase tracking-widest text-xs shadow-xl shadow-nexus-500/20" 
                                            icon={ShieldCheck} 
                                            disabled={selectedReq.status === 'Approved'}
                                            onClick={() => handleUpdateStatus('Approved')}
                                        >
                                            Authorize Allocation
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button 
                                                variant="secondary" 
                                                className="h-10 justify-center font-black uppercase tracking-widest text-[10px]" 
                                                icon={Clock}
                                                onClick={() => handleUpdateStatus('Soft Booked')}
                                                disabled={selectedReq.status === 'Soft Booked'}
                                            >
                                                Soft Book
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                className="h-10 justify-center font-black uppercase tracking-widest text-[10px]" 
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
                                <div className={`flex-1 flex flex-col items-center justify-center ${theme.colors.text.tertiary} nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-3xl`}>
                                    <div className="p-6 bg-white rounded-full shadow-lg mb-4 border border-slate-100">
                                        <ShieldAlert size={32} className="opacity-20 text-slate-400"/>
                                    </div>
                                    <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs">Decision Logic Pending</h5>
                                    <p className="text-[10px] mt-2 text-slate-400 font-medium px-8 text-center">Select an inbound demand signal to simulate capacity deltas across the enterprise graph.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </PanelContainer>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Initialize New Demand Signal"
                size="md"
                footer={<Button onClick={() => handleCreateRequest(newRequestData)}>Submit Demand Signal</Button>}
            >
                <div className="space-y-8 animate-nexus-in">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Target Project Context</label>
                        <select 
                            className={`w-full p-3.5 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all bg-slate-50/50`}
                            value={newRequestData.projectId}
                            onChange={e => setNewRequestData({...newRequestData, projectId: e.target.value})}
                        >
                            {state.projects.map(p => <option key={p.id} value={p.id}>{p.code}: {p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Critical Functional Role</label>
                        <Input 
                            value={newRequestData.role} 
                            onChange={e => setNewRequestData({...newRequestData, role: e.target.value})}
                            placeholder="e.g. Principal Structural Architect"
                            className="h-12 font-bold"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <Input 
                            label="Mandatory FTE Count" type="number" 
                            value={newRequestData.quantity}
                            onChange={e => setNewRequestData({...newRequestData, quantity: parseInt(e.target.value)})}
                        />
                        <Input 
                            label="Commencement Target" type="date"
                            value={newRequestData.startDate}
                            onChange={e => setNewRequestData({...newRequestData, startDate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Strategic Justification</label>
                        <textarea 
                            className={`w-full p-4 border border-slate-200 rounded-2xl text-sm h-32 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none resize-none bg-slate-50/30 font-medium leading-relaxed transition-all`}
                            value={newRequestData.notes}
                            onChange={e => setNewRequestData({...newRequestData, notes: e.target.value})}
                            placeholder="Summarize the impact of this allocation on the critical path finish date..."
                        />
                    </div>
                </div>
            </Modal>
        </PageLayout>
    );
};

export default ResourceNegotiationHub;
