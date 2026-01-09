
import React from 'react';
import { Document } from '../../../types';
import { FileText, FileSpreadsheet, FileCode, Image, MoreHorizontal, Folder } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface DocumentGridProps {
    docs: Document[];
    canUpload: boolean;
    triggerUpload: () => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({ docs, canUpload, triggerUpload }) => {
    const theme = useTheme();

    const getIcon = (type: string) => {
        const t = type.toUpperCase();
        if (['PDF'].includes(t)) return <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-sm"><FileText size={20}/></div>;
        if (['XLS', 'XLSX', 'CSV'].includes(t)) return <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100 shadow-sm"><FileSpreadsheet size={20}/></div>;
        if (['DWG', 'DXF'].includes(t)) return <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm"><Image size={20}/></div>;
        if (['JSON', 'XML'].includes(t)) return <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center border border-yellow-100 shadow-sm"><FileCode size={20}/></div>;
        return <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-200 shadow-sm"><FileText size={20}/></div>;
    };

    if (docs.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
                <EmptyGrid 
                    title="Document Repository Empty"
                    description="No files found in the current context. Upload specifications, drawings, or contracts to begin."
                    icon={Folder}
                    actionLabel="Upload First Document"
                    onAdd={canUpload ? triggerUpload : undefined}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-nexus-in">
            {docs.map(doc => (
                <div 
                    key={doc.id} 
                    className={`${theme.components.card} p-4 hover:shadow-md transition-all group cursor-pointer relative border border-slate-200 hover:border-nexus-300 flex flex-col`}
                    tabIndex={0}
                    role="button"
                >
                    <div className="flex justify-between items-start mb-3">
                        {getIcon(doc.type)}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                            <button className="p-1 hover:bg-slate-100 rounded text-slate-500" aria-label="Document options">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                         <h4 className={`text-sm font-bold ${theme.colors.text.primary} truncate mb-1`} title={doc.name}>{doc.name}</h4>
                         <p className={`text-xs ${theme.colors.text.secondary} truncate`}>
                             Uploaded by {doc.uploadedBy}
                         </p>
                    </div>

                    <div className={`flex justify-between items-center mt-4 pt-3 border-t ${theme.colors.border.replace('border-','border-slate-')}50`}>
                        <span className={`text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider`}>
                            {doc.size} • v{doc.version}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${
                            doc.status === 'Final' ? 'bg-green-50 text-green-700 border-green-200' : 
                            doc.status === 'Draft' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                            {doc.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
