
import React, { useRef, useMemo } from 'react';
import { Upload, Search, Folder, Filter, Lock, Loader2 } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { useDocumentControlLogic } from '../hooks/domain/useDocumentControlLogic';
import { useData } from '../context/DataContext';
import { generateId, formatFileSize } from '../utils/formatters';
import { Document } from '../types/index';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { DocumentStats } from './documents/control/DocumentStats';
import { DocumentGrid } from './documents/control/DocumentGrid';

const DocumentControl: React.FC = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const { project } = useProjectWorkspace(); 
  const theme = useTheme();
  
  const {
    searchTerm,
    setSearchTerm,
    deferredSearchTerm,
    docs,
    canUpload
  } = useDocumentControlLogic();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && project) {
          const docType = file.name.split('.').pop()?.toUpperCase() || 'DOC';
          const newDoc: Document = {
              id: generateId('DOC'),
              projectId: project.id,
              name: file.name,
              type: docType,
              size: formatFileSize(file.size),
              version: '1.0',
              uploadedBy: user?.name || 'System User', 
              status: 'Draft',
              url: '#'
          };

          dispatch({ type: 'UPLOAD_DOCUMENT', payload: newDoc });
      }
  };

  const triggerUpload = () => {
      fileInputRef.current?.click();
  };

  const storageMetrics = useMemo(() => {
    const totalLimitGB = state.governance.billing.storageLimitGB || 10;
    const totalBytes = state.documents.reduce((acc, d) => {
        const match = d.size.match(/(\d+(\.\d+)?)\s*(MB|KB|GB|B)/);
        if (!match) return acc;
        const num = parseFloat(match[1]);
        const unit = match[3];
        let bytes = num;
        if (unit === 'KB') bytes *= 1024;
        else if (unit === 'MB') bytes *= 1024 * 1024;
        else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
        return acc + bytes;
    }, 0);
    const usedGB = totalBytes / (1024 * 1024 * 1024);
    const percent = Math.min(100, Math.round((usedGB / totalLimitGB) * 100));
    return { percent, usedGB, limit: totalLimitGB };
  }, [state.documents, state.governance.billing.storageLimitGB]);

  return (
    <div className={`p-[var(--spacing-gutter)] flex flex-col h-full`}>
       <PageHeader
            title="Document Control"
            subtitle="Central repository for all project specifications, drawings, and reports."
            icon={Folder}
            actions={canUpload ? (
                <>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload} 
                    />
                    <button 
                        onClick={triggerUpload}
                        className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg flex items-center gap-2 hover:brightness-110 shadow-sm text-sm font-medium`}
                    >
                        <Upload size={16} /> <span className="hidden sm:inline">Upload Document</span>
                    </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                    <Lock size={14} /> Upload Restricted
                </div>
              )}
       />

       <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg flex-1 overflow-hidden flex flex-col shadow-sm`}>
          <div className={`p-4 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center gap-4 bg-white z-10`}>
             <div className="flex gap-4 w-full md:w-auto items-center">
                 <div className="relative flex-1 md:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search files..." 
                        className={`pl-9 pr-10 py-1.5 text-sm border ${theme.colors.border} rounded-md w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500 transition-all ${theme.colors.background} ${theme.colors.text.primary}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm !== deferredSearchTerm && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 size={12} className="animate-spin text-slate-300"/>
                        </div>
                    )}
                 </div>
                 <button className={`flex items-center gap-1.5 px-3 py-1.5 ${theme.colors.surface} border ${theme.colors.border} rounded-md text-sm text-slate-600 hover:bg-slate-50`}>
                    <Filter size={14} /> Filter
                 </button>
             </div>
             
             <DocumentStats 
                usedGB={storageMetrics.usedGB}
                limitGB={storageMetrics.limit}
                percent={storageMetrics.percent}
             />
          </div>

          <div className={`flex-1 overflow-auto p-6 transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'} bg-slate-50/50`}>
             <h3 className={`text-xs font-black ${theme.colors.text.tertiary} mb-4 uppercase tracking-widest`}>File Registry</h3>
             <DocumentGrid 
                docs={docs} 
                canUpload={canUpload} 
                triggerUpload={triggerUpload} 
             />
          </div>
       </div>
    </div>
  );
};

export default DocumentControl;
