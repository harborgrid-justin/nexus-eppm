
import React, { useRef } from 'react';
import { Download, MoreHorizontal, Upload, Search, Folder, Filter, Lock, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';
import { useDocumentControlLogic } from '../hooks/domain/useDocumentControlLogic';
import { useData } from '../context/DataContext';
import { generateId, formatFileSize } from '../utils/formatters';
import { Document } from '../types';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';

const DocumentControl: React.FC = () => {
  const theme = useTheme();
  const { dispatch } = useData();
  const { project } = useProjectWorkspace(); // Get active project context
  
  const {
    searchTerm,
    setSearchTerm,
    deferredSearchTerm,
    docs,
    canUpload
  } = useDocumentControlLogic();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = (type: string) => {
     switch(type) {
        case 'PDF': return <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">PDF</div>;
        case 'XLSX': return <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">XLS</div>;
        case 'DWG': return <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">DWG</div>;
        default: return <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">DOC</div>;
     }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && project) {
          // Simulate upload process
          const docType = file.name.split('.').pop()?.toUpperCase() || 'DOC';
          const newDoc: Document = {
              id: generateId('DOC'),
              projectId: project.id,
              name: file.name,
              type: docType,
              size: formatFileSize(file.size),
              version: '1.0',
              uploadedBy: 'Current User', // In real app, use auth context
              status: 'Draft',
              url: '#'
          };

          dispatch({ type: 'UPLOAD_DOCUMENT', payload: newDoc });
      }
  };

  const triggerUpload = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
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
                        className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg flex items-center gap-2 ${theme.colors.primaryHover} shadow-sm text-sm font-medium`}
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

       <div className={`${theme.components.card} flex-1 overflow-hidden flex flex-col`}>
          <div className={`p-4 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center gap-4`}>
             <div className="flex gap-4 w-full md:w-auto">
                 <div className="relative flex-1 md:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search files..." 
                        className={`pl-9 pr-10 py-1.5 text-sm border ${theme.colors.border} rounded-md w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500 transition-all`}
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
             <div className="flex items-center gap-2 text-sm text-slate-500 w-full md:w-auto justify-end">
                <span>Storage Used: </span>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-nexus-500 w-[65%]"></div>
                </div>
                <span className="font-medium text-slate-700">65%</span>
             </div>
          </div>

          <div className={`flex-1 overflow-auto p-6 transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
             <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Recent Uploads</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {docs.map(doc => (
                   <div 
                      key={doc.id} 
                      className={`p-4 border ${theme.colors.border} rounded-lg hover:border-nexus-300 hover:shadow-md transition-all ${theme.colors.surface} group cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-nexus-500`}
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
                      <h4 className="text-sm font-semibold text-slate-900 truncate" title={doc.name}>{doc.name}</h4>
                      <div className="flex justify-between items-end mt-2">
                         <div className="text-xs text-slate-500">
                            <p>{doc.size} • v{doc.version}</p>
                            <p className="mt-0.5">{doc.uploadedBy}</p>
                         </div>
                         <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            doc.status === 'Final' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                         }`}>
                            {doc.status}
                         </span>
                      </div>
                   </div>
                ))}
                {docs.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <Folder size={48} className="mx-auto mb-4 opacity-20"/>
                        <p>No documents found.</p>
                        {canUpload && <button onClick={triggerUpload} className="text-nexus-600 font-bold hover:underline mt-2">Upload your first file</button>}
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default DocumentControl;
