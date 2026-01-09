
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FileText, Table, Activity, TrendingUp, AlertTriangle, Play, Printer } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ReportDocument } from './ReportDocument';
import { Modal } from '../ui/Modal';

export const StandardReportLibrary: React.FC = () => {
    const theme = useTheme();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    const reports = [
        { id: 'status_summary', title: 'Monthly Status Report', category: 'General', description: 'High-level executive summary of project health, schedule, and key issues.', icon: FileText },
        { id: 'cost_ledger', title: 'Cost Ledger Detail', category: 'Financial', description: 'Detailed transaction log of all budget changes, commitments, and actuals.', icon: Table },
        { id: 'risk_register', title: 'Risk Register Export', category: 'Risk', description: 'Comprehensive list of active risks, scores, and mitigation plans.', icon: AlertTriangle },
        { id: 'evm_analysis', title: 'Earned Value Analysis', category: 'Performance', description: 'SPI, CPI, and EAC forecasting metrics by WBS.', icon: TrendingUp },
        { id: 'resource_load', title: 'Resource Utilization', category: 'Resource', description: 'Staffing demand vs capacity heatmaps.', icon: Activity },
    ];

    const runReport = (id: string) => {
        setSelectedReport(id);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {selectedReport ? (
                <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
                        <Button variant="secondary" onClick={() => setSelectedReport(null)}>Back to Library</Button>
                        <h3 className="font-bold text-slate-800">{reports.find(r => r.id === selectedReport)?.title}</h3>
                        <Button icon={Printer} onClick={() => window.print()}>Print / PDF</Button>
                    </div>
                    <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-500/10">
                        <ReportDocument reportId={selectedReport} />
                    </div>
                </div>
            ) : (
                <div className="p-8 overflow-y-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Standard Report Library</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map(report => (
                            <Card key={report.id} className="p-6 flex flex-col hover:border-nexus-400 transition-colors group cursor-pointer" onClick={() => runReport(report.id)}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors`}>
                                        <report.icon size={24}/>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{report.category}</span>
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-nexus-700">{report.title}</h4>
                                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">{report.description}</p>
                                <Button className="w-full" variant="secondary" icon={Play}>Generate Report</Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
