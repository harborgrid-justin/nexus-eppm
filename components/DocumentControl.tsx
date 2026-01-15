
import React, { useRef, useMemo } from 'react';
import { Upload, Search, Folder, Filter, Lock, Loader2 } from 'lucide-react';
import { useDocumentControlLogic } from '../hooks/domain/useDocumentControlLogic';
import { useData } from '../context/DataContext';
import { generateId, formatFileSize } from '../utils/formatters';
import { Document } from '../types/index';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { DocumentStats } from './documents/control/DocumentStats';
import { DocumentGrid } from './documents/control/DocumentGrid';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';
import { Button } from './ui/Button';

const DocumentControl: React.FC = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const { project } = useProjectWorkspace(); 
  const theme = useTheme();
  
  const {
    searchTerm, setSearchTerm, deferredSearchTerm, docs, canUpload
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

  const triggerUpload = () => fileInputRef.current?.click();

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
    <PageLayout
        title="Document Repository"
        subtitle="Authoritative storage for all project specifications and drawings."
        icon={Folder}
        actions={canUpload ? (
            <>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <Button onClick={triggerUpload} icon={Upload} className="shadow-lg">Upload Artifact</Button>
            </>
          ) : (
            <div className={`flex items-center gap-2 text-xs text-slate-400 ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border} uppercase font-black tracking-widest`}>
                <Lock size={14} /> Repository Locked
            </div>
          )}
    >
        <PanelContainer
            header={
                <div className={`p-4 flex flex-col md:flex-row justify-between items-center gap-4`}>
                    <div className="flex gap-4 w-full md:w-auto items-center">
                        <div className="relative flex-1 md:flex-none">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search partition..." 
                                className={`pl-9 pr-10 py-2 text-sm border ${theme.colors.border} rounded-xl w-full md:w-64 focus:outline-none focus:ring-4 focus:ring-nexus-500/5 transition-all bg-slate-50`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
                    </div>
                    <DocumentStats usedGB={storageMetrics.usedGB} limitGB={storageMetrics.limit} percent={storageMetrics.percent} />
                </div>
            }
        >
            <div className={`flex-1 overflow-auto p-8 transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'} nexus-empty-pattern`}>
                <DocumentGrid docs={docs} canUpload={canUpload} triggerUpload={triggerUpload} />
            </div>
        </PanelContainer>
    </PageLayout>
  );
};
export default DocumentControl;
