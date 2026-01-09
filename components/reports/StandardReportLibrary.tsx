
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { FileText, Table, Activity, TrendingUp, AlertTriangle, Play, Printer, Plus, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ReportDocument } from './ReportDocument';
import { ReportBuilder } from './ReportBuilder';

const ICON_MAP: Record<string, any> = {
    FileText, Table, Activity, TrendingUp, AlertTriangle
};

export const StandardReportLibrary: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);

    const reports = state.reportDefinitions;

    const runReport = (id: string) => {
        setSelectedReport(id);
    };

    const handleCreate = (report: any) => {
        dispatch({ type: 'ADD_REPORT_DEF', payload: report });
        setIsBuilderOpen(false);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this custom report definition?")) {
            dispatch({ type: 'DELETE_REPORT_DEF', payload: id });
        }
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
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Standard Report Library</h3>
                        <Button icon={Plus} onClick={() => setIsBuilderOpen(true)}>Create Report</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map(report => {
                            const Icon = ICON_MAP[report.icon] || FileText;
                            return (
                                <Card key={report.id} className="p-6 flex flex-col hover:border-nexus-400 transition-colors group cursor-pointer relative" onClick={() => runReport(report.id)}>
                                    {report.type === 'Custom' && (
                                        <button onClick={(e) => handleDelete(report.id, e)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={14}/></button>
                                    )}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors`}>
                                            <Icon size={24}/>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{report.category}</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-nexus-700">{report.title}</h4>
                                    <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">{report.description}</p>
                                    <Button className="w-full" variant="secondary" icon={Play}>Generate Report</Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
            <ReportBuilder isOpen={isBuilderOpen} onClose={() => setIsBuilderOpen(false)} onSave={handleCreate} />
        </div>
    );
};
