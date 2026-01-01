
import React from 'react';
import { FileText, X, Download } from 'lucide-react';

interface DocumentPreviewProps {
  document: { name: string; type: string; url: string };
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={18} className="text-nexus-600"/> {document.name}
                </h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded text-slate-600"><Download size={18}/></button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded text-slate-600"><X size={18}/></button>
                </div>
            </div>
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-8">
                <div className="bg-white shadow-lg p-12 text-center text-slate-400 border border-slate-200 rounded">
                    <FileText size={64} className="mx-auto mb-4 opacity-50"/>
                    <p>Preview not available for {document.type} files in this demo.</p>
                </div>
            </div>
        </div>
    </div>
  );
};
