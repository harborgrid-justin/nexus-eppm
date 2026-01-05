
import React, { useMemo } from 'react';
import { Database, Lock, CheckCircle, XCircle, RefreshCw, Unlock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatters';
import { useData } from '../../../context/DataContext';

export const ErpConnector: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const transactions = state.extensionData.erpTransactions || [];

    // Derive active change order to display in the gate visual
    // We pick the most recently updated change order for demo purposes
    const latestChangeOrder = useMemo(() => {
        const cos = state.changeOrders;
        return cos.length > 0 ? cos[cos.length - 1] : null;
    }, [state.changeOrders]);

    const gateStatus = latestChangeOrder?.status === 'Approved' ? 'Open' : 'Locked';

    return (
        <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
                            <Database className="text-blue-600"/> Universal ERP Connector
                        </h2>
                        <p className={`text-sm ${theme.colors.text.secondary} mt-1`}>SAP / Oracle Financials Gateway</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live Sync
                    </div>
                </div>

                {/* Cost Gate Logic Visualization */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                        {gateStatus === 'Open' ? <Unlock className="text-green-500"/> : <Lock className="text-yellow-500"/>} Cost Gate Logic Flow
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        {/* Nexus Side */}
                        <div className={`bg-slate-800 p-6 rounded-xl border w-64 text-center transition-colors ${gateStatus === 'Open' ? 'border-green-500/30' : 'border-slate-700'}`}>
                            <div className="text-nexus-400 font-bold mb-2">NEXUS PPM</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">Source</div>
                            <div className="bg-slate-700 p-3 rounded mb-2">
                                <p className="text-xs text-slate-300">
                                    {latestChangeOrder ? latestChangeOrder.title : 'No Pending Changes'}
                                </p>
                                <p className="font-mono font-bold text-white mt-1">
                                    {latestChangeOrder ? formatCurrency(latestChangeOrder.amount) : '$0.00'}
                                </p>
                            </div>
                            <div className={`text-[10px] font-bold uppercase ${latestChangeOrder?.status === 'Approved' ? 'text-green-400' : 'text-yellow-500'}`}>
                                Status: {latestChangeOrder ? latestChangeOrder.status : 'Idle'}
                            </div>
                        </div>

                        {/* The Gate */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="h-1 w-full bg-slate-700 relative">
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-3 rounded-full border-4 z-10 transition-all duration-500 ${gateStatus === 'Open' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-yellow-500'}`}>
                                    {gateStatus === 'Open' ? <CheckCircle size={24} className="text-green-500" /> : <Lock size={24} className="text-yellow-500" />}
                                </div>
                            </div>
                            <div className={`mt-4 border p-3 rounded text-center transition-colors ${gateStatus === 'Open' ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                                <p className={`text-xs font-bold uppercase ${gateStatus === 'Open' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {gateStatus === 'Open' ? 'Validation Passed' : 'Validation Pending'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Check PO Limit &lt; Budget Cap</p>
                            </div>
                        </div>

                        {/* ERP Side */}
                        <div className={`bg-slate-800 p-6 rounded-xl border w-64 text-center transition-opacity duration-500 ${gateStatus === 'Open' ? 'opacity-100 border-blue-500/30' : 'opacity-50 border-slate-700'}`}>
                            <div className="text-blue-400 font-bold mb-2">SAP S/4HANA</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">Destination</div>
                            <div className="bg-slate-700 p-3 rounded mb-2">
                                <p className="text-xs text-slate-300">
                                    {gateStatus === 'Open' ? 'GL Journal Entry' : 'Waiting for Data...'}
                                </p>
                                <p className="font-mono font-bold text-green-400 mt-1">
                                    {gateStatus === 'Open' ? 'Committed' : '---'}
                                </p>
                            </div>
                            <div className="text-[10px] text-slate-500">{gateStatus === 'Open' ? 'Ledger Updated' : 'Standby'}</div>
                        </div>
                    </div>
                </div>

                {/* Transaction Log */}
                <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                        <h4 className={`font-bold ${theme.colors.text.secondary} text-sm uppercase tracking-widest`}>Recent Transactions</h4>
                        <button className="text-xs font-bold text-nexus-600 flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Refresh Log</button>
                    </div>
                    <table className="min-w-full text-sm">
                        <thead className={`${theme.colors.background} ${theme.colors.text.secondary}`}>
                            <tr>
                                <th className="px-6 py-3 text-left font-bold">Transaction ID</th>
                                <th className="px-6 py-3 text-left font-bold">Type</th>
                                <th className="px-6 py-3 text-right font-bold">Amount</th>
                                <th className="px-6 py-3 text-center font-bold">Gate Result</th>
                                <th className="px-6 py-3 text-left font-bold">ERP Response</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-','divide-')}`}>
                            {transactions.map(tx => (
                                <tr key={tx.id} className={`hover:${theme.colors.background}`}>
                                    <td className={`px-6 py-4 font-mono text-xs ${theme.colors.text.tertiary}`}>{tx.id}</td>
                                    <td className={`px-6 py-4 ${theme.colors.text.primary}`}>{tx.type}</td>
                                    <td className={`px-6 py-4 text-right font-mono ${theme.colors.text.primary}`}>
                                        {typeof tx.amount === 'number' ? formatCurrency(tx.amount) : tx.amount}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {tx.status === 'Success' ? <CheckCircle size={16} className="text-green-500 inline"/> : 
                                         tx.status === 'Failed' ? <XCircle size={16} className="text-red-500 inline"/> : 
                                         <RefreshCw size={16} className="text-yellow-500 inline animate-spin"/>}
                                    </td>
                                    <td className={`px-6 py-4 text-xs font-mono ${tx.status === 'Failed' ? 'text-red-600' : 'text-slate-600'}`}>
                                        {tx.response}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr><td colSpan={5} className={`p-4 text-center ${theme.colors.text.tertiary}`}>No ERP transactions logged.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
