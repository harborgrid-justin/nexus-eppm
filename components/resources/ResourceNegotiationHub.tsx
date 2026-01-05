
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
                                <span className={`text-xs font-bold ${theme.colors.text.secondary}`}>{req.startDate} <ArrowRight size={12} className="inline mx-1"/> {req.endDate}</span>
                            </div>
                            <h4 className={`font-bold ${theme.colors.text.primary} text-lg mb-1`}>{req.role} <span className="text-slate-400 font-normal">x{req.quantity}</span></h4>
                            <div className="flex justify-between items-center mt-3">
                                <div className={`text-sm ${theme.colors.text.tertiary} flex items-center gap-2`}>
                                    <Users size={14} className="text-nexus-600"/>
                                    for <strong>{req.projectName}</strong>
                                </div>
                                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.secondary}`}>
                                    <div className={`w-6 h-6 rounded-full ${theme.colors.background} flex items-center justify-center font-bold ${theme.colors.text.tertiary}`}>
                                        {req.requesterName.charAt(0)}
                                    </div>
                                    {req.requesterName}
                                </div>
                            </div>
                        </Card>
                    ))}
                    {requests.length === 0 && (
                        <div className={`p-12 text-center ${theme.colors.text.tertiary} border-2 border-dashed ${theme.colors.border} rounded-xl`}>
                            No active resource requests.
                        </div>
                    )}
                </div>

                {/* Impact Analysis Panel */}
                {selectedReq ? (
                    <div className="w-[450px] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                        <Card className={`p-6 ${theme.colors.background} border-${theme.colors.border}`}>
                            <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                                <TrendingUp size={18} className="text-nexus-600"/> Impact Analysis
                            </h3>
                            
                            {impactData && (
                                <div className="space-y-6">
                                    <div>
                                        <div className={`flex justify-between text-xs font-bold ${theme.colors.text.secondary} uppercase mb-2`}>
                                            <span>Role Utilization (Current)</span>
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
                                            <div className="mt-2 p-2 bg-red-100 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
                                                <AlertCircle size={14}/> <strong>Over-allocation Warning:</strong> Capacity exceeded.
                                            </div>
                                        )}
                                    </div>

                                    <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${theme.colors.border}`}>
                                        <div className={`text-center p-3 ${theme.colors.surface} rounded-lg border ${theme.colors.border}`}>
                                            <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase font-bold`}>Total Pool</p>
                                            <p className={`text-2xl font-black ${theme.colors.text.primary}`}>{impactData.roleCount}</p>
                                        </div>
                                        <div className={`text-center p-3 ${theme.colors.surface} rounded-lg border ${theme.colors.border}`}>
                                            <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase font-bold`}>Available</p>
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

                        <div className={`p-4 rounded-xl border border-dashed ${theme.colors.border} text-center ${theme.colors.text.secondary} text-sm`}>
                            <p className="mb-2">Alternative Suggestion:</p>
                            <span className="font-bold text-nexus-600 cursor-pointer hover:underline">Shift start date to Aug 15</span> to reduce peak load.
                        </div>
                    </div>
                ) : (
                    <div className={`w-[450px] flex items-center justify-center ${theme.colors.text.tertiary} border-2 border-dashed ${theme.colors.border} rounded-xl ${theme.colors.background}/50`}>
                        <p>Select a request to view impact analysis.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceNegotiationHub;
