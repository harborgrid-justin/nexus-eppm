import React from 'react';
import { NonConformanceReport } from '../../../types';
import { X, AlertTriangle, Link } from 'lucide-react';
import { Button } from '../../ui/Button';

interface DefectDetailViewProps {
    defect: NonConformanceReport;
    onClose: () => void;
}

export const DefectDetailView: React.FC<DefectDetailViewProps> = ({ defect, onClose }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-black text-slate-900">{defect.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${defect.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{defect.severity}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{defect.description}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                        <p className="text-sm font-medium">{defect.category}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Vendor</label>
                        <p className="text-sm font-medium">{defect.vendorId || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Linked Task</label>
                        <p className="text-sm font-medium flex items-center gap-2">
                            {defect.linkedTaskId || 'None'}
                            {defect.linkedTaskId && <Link size={12} className="text-blue-500"/>}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                        <p className="text-sm font-bold text-slate-900">{defect.status}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-800 mb-2">Root Cause Analysis</h4>
                    <p className="text-sm text-slate-600 italic">Pending investigation...</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="secondary">Mark as Resolved</Button>
                    <Button variant="danger">Escalate</Button>
                </div>
            </div>
        </div>
    );
};
