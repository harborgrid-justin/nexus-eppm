
import React from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ReportDocumentProps {
    reportId: string;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ reportId }) => {
    const { state } = useData();
    const orgName = state.governance.organization.name;
    const date = new Date().toLocaleDateString();

    const renderContent = () => {
        switch(reportId) {
            case 'status_summary':
                return (
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-widest">Executive Summary</h3>
                            <p className="text-sm text-slate-700 leading-relaxed text-justify">
                                The overall portfolio health remains stable with {state.projects.filter(p => p.health === 'Good').length} projects reporting 'Good' status. 
                                Key milestones for the quarter have been met, although {state.projects.filter(p => p.health === 'Critical').length} initiatives require executive attention due to budget variances.
                            </p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-widest">Project Performance</h3>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-2 border">Project</th>
                                        <th className="p-2 border">Manager</th>
                                        <th className="p-2 border">Health</th>
                                        <th className="p-2 border text-right">Budget</th>
                                        <th className="p-2 border text-right">Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.projects.map(p => (
                                        <tr key={p.id}>
                                            <td className="p-2 border font-bold">{p.name}</td>
                                            <td className="p-2 border">{p.managerId}</td>
                                            <td className="p-2 border">{p.health}</td>
                                            <td className="p-2 border text-right font-mono">{formatCurrency(p.budget)}</td>
                                            <td className="p-2 border text-right font-mono">{formatCurrency(p.spent)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                );
            case 'cost_ledger':
                return (
                    <div className="space-y-8">
                         <section>
                            <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-widest">Transaction Ledger</h3>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-2 border">Date</th>
                                        <th className="p-2 border">Description</th>
                                        <th className="p-2 border">Source</th>
                                        <th className="p-2 border">Project</th>
                                        <th className="p-2 border text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.projects.flatMap(p => (p.budgetLog || []).map(l => ({...l, projectName: p.name}))).map((log, i) => (
                                        <tr key={i}>
                                            <td className="p-2 border font-mono">{log.date}</td>
                                            <td className="p-2 border">{log.description}</td>
                                            <td className="p-2 border">{log.source}</td>
                                            <td className="p-2 border">{log.projectName}</td>
                                            <td className="p-2 border text-right font-mono">{formatCurrency(log.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                );
             case 'risk_register':
                return (
                    <div className="space-y-8">
                         <section>
                            <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-widest">Active Risk Register</h3>
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="p-2 border">ID</th>
                                        <th className="p-2 border">Description</th>
                                        <th className="p-2 border">Category</th>
                                        <th className="p-2 border text-center">Score</th>
                                        <th className="p-2 border text-right">Exposure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.risks.map((r, i) => (
                                        <tr key={i}>
                                            <td className="p-2 border font-mono">{r.id}</td>
                                            <td className="p-2 border">{r.description}</td>
                                            <td className="p-2 border">{r.category}</td>
                                            <td className="p-2 border text-center font-bold">{r.score}</td>
                                            <td className="p-2 border text-right font-mono">{formatCurrency(r.financialImpact || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                );
            default:
                return <div>Report template not found.</div>;
        }
    };

    return (
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-12 text-slate-900 mx-auto">
            {/* Report Header */}
            <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{reportId.replace('_', ' ')}</h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">{orgName}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Generated On</p>
                    <p className="font-mono font-bold">{date}</p>
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[600px]">
                {renderContent()}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <span>Nexus PPM Enterprise</span>
                <span>Confidential - Internal Use Only</span>
                <span>Page 1 of 1</span>
            </div>
        </div>
    );
};
