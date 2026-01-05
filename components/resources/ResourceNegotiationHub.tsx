
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Users, ArrowRight, XCircle, AlertCircle, TrendingUp, UserCheck, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useResourceNegotiationLogic } from '../../hooks/domain/useResourceNegotiationLogic';

const ResourceNegotiationHub: React.FC = () => {
    const theme = useTheme();
    const { 
        requests,
        selectedReqId,
        setSelectedReqId,
        viewMode,
        setViewMode,
        selectedReq,
        impactData,
        handleUpdateStatus
    } = useResourceNegotiationLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Resource Negotiation</h2>
                    <p className={theme.typography.small}>Allocation balancing and request fulfillment.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button 
                        onClick={() => setViewMode('manager')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'manager' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Incoming Requests
                    </button>
                    <button 
                        onClick={() => setViewMode('requester')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'requester' ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        My Demands
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Request List */}
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
                                <span className="text-xs font-bold text-slate-500">{req.startDate} <ArrowRight size={12} className="inline mx-1"/> {req.endDate}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{req.role} <span className="text-slate-400 font-normal">x{req.quantity}</span></h4>
                            <div className="flex justify-between items-center mt-3">
                                <div className="text-sm text-slate-600 flex items-center gap-2">
                                    <Users size={14} className="text-nexus-600"/>
                                    for <strong>{req.projectName}</strong>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                        {req.requesterName.charAt(0)}
                                    </div>
                                    {req.requesterName}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {requests.length === 0 && (
                        <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                            No active resource requests.
                        </div>
                    )}
                </div>

                {/* Impact Analysis Panel */}
                {selectedReq ? (
                    <div className="w-[450px] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                        <Card className="p-6 bg-slate-50 border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-nexus-600"/> Impact Analysis
                            </h3>
                            
                            {impactData && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                            <span>Role Utilization (Current)</span>
                                            <span>{impactData.currentUtilization}%</span>
                                        </div>
                                        <ProgressBar value={impactData.currentUtilization} colorClass="bg-blue-500" />
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                            <span>Projected Load (+Request)</span>
                                            <span className={impactData.newUtilization > 100 ? 'text-red-600' : 'text-nexus-600'}>{impactData.newUtilization}%</span>
                                        </div>
                                        <ProgressBar value={impactData.newUtilization} thresholds />
                                        {impactData.newUtilization > 100 && (
                                            <div className="mt-2 p-2 bg-red-100 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
                                                <AlertCircle size={14}/> <strong>Over-allocation Warning:</strong> Capacity exceeded.
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Total Pool</p>
                                            <p className="text-2xl font-black text-slate-900">{impactData.roleCount}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">Available</p>
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
                                disabled={selectedReq.status === 'Approved' || (impactData && impactData.newUtilization > 120)}
                                onClick={() => handleUpdateStatus('Approved')}
                            >
                                Hard Book Allocation
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

                        <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-sm">
                            <p className="mb-2">Alternative Suggestion:</p>
                            <span className="font-bold text-nexus-600 cursor-pointer hover:underline">Shift start date to Aug 15</span> to reduce peak load.
                        </div>
                    </div>
                ) : (
                    <div className="w-[450px] flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <p>Select a request to view impact analysis.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceNegotiationHub;
