import React from 'react';
import { QualityReport } from '../../../types';
import { InspectionChecklist } from '../QualityControlLog';
import { CheckSquare, Square, X, Camera, MessageSquare } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ControlLogDetailProps {
    report: QualityReport;
    checklist: InspectionChecklist;
    onClose: () => void;
}

export const ControlLogDetail: React.FC<ControlLogDetailProps> = ({ report, checklist, onClose }) => {
    const theme = useTheme();
    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden border-l border-slate-200">
            <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
                <div>
                    <h3 className="font-bold text-slate-800">{report.type} Details</h3>
                    <p className="text-xs text-slate-500">{report.id}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={18}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Inspection Checklist</h4>
                    <div className="space-y-3">
                        {checklist.items.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                                {item.status === 'Pass' ? <CheckSquare className="text-green-500 shrink-0" size={18}/> : <Square className="text-red-400 shrink-0" size={18}/>}
                                <div className="flex-1">
                                    <p className={`text-sm ${item.status === 'Pass' ? 'text-slate-700' : 'text-red-700 font-medium'}`}>{item.label}</p>
                                    {item.comment && <p className="text-xs text-slate-500 mt-1 italic">{item.comment}</p>}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Pass' ? 'bg-green-50 text-green-700' : item.status === 'Fail' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Camera size={20}/></div>
                         <div>
                             <p className="font-bold text-slate-800">{checklist.photos} Photos</p>
                             <p className="text-xs text-slate-500">Attached Evidence</p>
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                         <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MessageSquare size={20}/></div>
                         <div>
                             <p className="font-bold text-slate-800">Comments</p>
                             <p className="text-xs text-slate-500">View thread</p>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
