
import React, { useMemo } from 'react';
import { Database, Lock, CheckCircle, XCircle, RefreshCw, Unlock, ShieldCheck, Landmark } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatters';
import { useData } from '../../../context/DataContext';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

export const ErpConnector: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const transactions = state.extensionData.erpTransactions || [];

    const latestChangeOrder = useMemo(() => {
        const cos = state.changeOrders;
        return cos.length > 0 ? cos[cos.length - 1] : null;
    }, [state.changeOrders]);

    const gateStatus = latestChangeOrder?.status === 'Approved' ? 'Open' : 'Locked';

    const handlePoll = () => {
        // Trigger a mock poll action
        const mockTransaction = {
             id: `ERP-TX-${Date.now()}`,
             type: 'POLL_SYNC',
             amount: 0,
             status: 'Success',
             response: 'Heartbeat Check OK - No new records.'
        };
        dispatch({ 
             type: 'EXTENSION_UPDATE_FINANCIAL', 
             payload: { erpTransactions: [mockTransaction, ...transactions] } 
        });
    };

    return (
        <div className={`h-full p-10 overflow-y-auto scrollbar-thin ${theme.colors.background}/30 animate-in fade-in duration-500`}>
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                         <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20"><Database size={32}/></div>
                         <div>
                            <h2 className={`text-3xl font-black ${theme.colors.text.primary} uppercase tracking-tighter`}>Universal ERP Gateway</h2>
                            <p className={`text-sm ${theme.colors.text.secondary} mt-1 font-medium`}>Authoritative bi-directional fiscal handshake for SAP S/4HANA & Oracle Financials.</p>
                         </div>
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-2.5 ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} rounded-2xl border ${theme.colors.semantic.success.border} text-xs font-black uppercase tracking-[0.2em] shadow-sm`}>
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div> Real-time Socket Active
                    </div>
                </div>

                {/* Cost Gate Logic Visualization */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group border border-white/5">
                    <div className="absolute top-0 right-0 p-48 bg-blue-600/10 rounded-full blur-[120px] -mr-24 -mt-24 pointer-events-none group-hover:bg-blue-600/15 transition-all"></div>
                    
                    <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8 relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-4">
                            {gateStatus === 'Open' ? <Unlock className="text-green-400" size={28}/> : <Lock className="text-yellow-400" size={28}/>} 
                            Governance Flow Validator
                        </h3>
                        <Badge variant="info" className="font-mono text-[10px] tracking-widest bg-white/10 text-white border-white/20">LOGIC_GATE_v1.2</Badge>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        {/* Nexus Side */}
                        <div className={`bg-slate-800 p-8 rounded-3xl border-2 w-full lg:w-72 text-center transition-all duration-500 hover:scale-105 ${gateStatus === 'Open' ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-700 shadow-inner'}`}>
                            <div className="text-nexus-400 font-black uppercase tracking-widest text-xs mb-3">Nexus Core Ledger</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mb-6">Source Signal</div>
                            <div className="bg-slate-900/50 p-5 rounded-2xl mb-4 border border-white/5 shadow-inner">
                                <p className="text-[10px] text-slate-400 uppercase font-bold truncate">
                                    {latestChangeOrder ? latestChangeOrder.title : 'Waiting for Input...'}
                                </p>
                                <p className="font-mono font-black text-white text-xl mt-2">
                                    {latestChangeOrder ? formatCurrency(latestChangeOrder.amount) : '$0.00'}
                                </p>
                            </div>
                            <Badge variant={latestChangeOrder?.status === 'Approved' ? 'success' : 'warning'} className="font-black text-[9px] uppercase">{latestChangeOrder ? latestChangeOrder.status : 'Standby'}</Badge>
                        </div>

                        {/* The Logic Pipe */}
                        <div className="flex-1 flex flex-col items-center w-full max-w-[200px]">
                            <div className="h-1.5 w-full bg-slate-800 relative rounded-full shadow-inner">
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-5 rounded-full border-4 z-10 transition-all duration-700 ${gateStatus === 'Open' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)] scale-110' : 'border-yellow-500 opacity-60'}`}>
                                    {gateStatus === 'Open' ? <CheckCircle size={32} className="text-green-500" /> : <Lock size={32} className="text-yellow-500" />}
                                </div>
                            </div>
                            <div className={`mt-10 border p-4 rounded-2xl text-center transition-all duration-700 w-full ${gateStatus === 'Open' ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/5 border-yellow-500/20 opacity-50'}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${gateStatus === 'Open' ? 'text-green-400' : 'text-yellow-500'}`}>
                                    {gateStatus === 'Open' ? 'Handshake Certified' : 'Lock Active'}
                                </p>
                                <p className="text-[9px] text-slate-400 mt-1 font-medium uppercase tracking-tight">Compliance Rule: CO_AUTH_101</p>
                            </div>
                        </div>

                        {/* ERP Side */}
                        <div className={`bg-slate-800 p-8 rounded-3xl border-2 w-full lg:w-72 text-center transition-all duration-700 ${gateStatus === 'Open' ? 'opacity-100 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'opacity-40 border-slate-700 grayscale'}`}>
                            <div className="text-blue-400 font-black uppercase tracking-widest text-xs mb-3">SAP S/4HANA CLOUD</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mb-6">Target Warehouse</div>
                            <div className="bg-slate-900/50 p-5 rounded-2xl mb-4 border border-white/5 shadow-inner">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">
                                    {gateStatus === 'Open' ? 'Journal Commitment' : 'Standby Mode'}
                                </p>
                                <p className="font-mono font-black text-green-400 text-xl mt-2">
                                    {gateStatus === 'Open' ? 'POSTED' : '---'}
                                </p>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{gateStatus === 'Open' ? 'Immutable Record Created' : 'Link Awaiting Signal'}</div>
                        </div>
                    </div>
                </div>

                {/* Transaction Log */}
                <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-[2rem] shadow-sm overflow-hidden flex flex-col bg-white`}>
                    <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                        <h4 className={`font-black ${theme.colors.text.primary} text-xs uppercase tracking-[0.2em] flex items-center gap-2`}>
                            <Landmark size={16} className="text-nexus-600" /> Recent Integration Transactions
                        </h4>
                        <button 
                            onClick={handlePoll}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-nexus-600 transition-all shadow-sm active:scale-95"
                        >
                             <RefreshCw size={12} className="inline mr-2"/> Poll Hub
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[500px] scrollbar-thin">
                        {transactions.length > 0 ? (
                            <table className="min-w-full text-sm border-separate border-spacing-0">
                                <thead className={`bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0 z-20 shadow-sm`}>
                                    <tr>
                                        <th className="px-8 py-5 text-left border-b border-slate-100">Handshake ID</th>
                                        <th className="px-6 py-5 text-left border-b border-slate-100">Vector Type</th>
                                        <th className="px-6 py-5 text-right border-b border-slate-100">Fiscal Delta</th>
                                        <th className="px-6 py-5 text-center border-b border-slate-100">Gate Verification</th>
                                        <th className="px-8 py-5 text-left border-b border-slate-100">ERP Response Message</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-slate-50 bg-white`}>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className={`hover:bg-slate-50 transition-colors group`}>
                                            <td className={`px-8 py-4 font-mono text-xs font-black text-slate-400 group-hover:text-nexus-600 transition-colors`}>{tx.id}</td>
                                            <td className={`px-6 py-4 font-bold text-slate-700 uppercase text-xs`}>{tx.type}</td>
                                            <td className={`px-6 py-4 text-right font-mono font-black text-slate-900`}>
                                                {typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {tx.status === 'Success' ? <CheckCircle size={18} className="text-green-500 inline shadow-sm"/> : 
                                                tx.status === 'Failed' ? <XCircle size={18} className="text-red-500 inline shadow-sm"/> : 
                                                <RefreshCw size={18} className="text-yellow-500 inline animate-spin"/>}
                                            </td>
                                            <td className={`px-8 py-4 text-[11px] font-medium ${tx.status === 'Failed' ? 'text-red-600' : 'text-slate-500'} truncate max-w-md italic`} title={tx.response}>
                                                "{tx.response}"
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-64">
                                <EmptyGrid title="Transaction Stream Isolated" description="No handshake events found for the current ERP endpoint configuration." icon={Landmark} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
