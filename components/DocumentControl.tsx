
import React from 'react';
import { useData } from '../context/DataContext';
import { Download, MoreHorizontal, Upload, Search, Folder, Sliders, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';

interface DocumentControlProps {
   projectId: string;
}

const DocumentControl: React.FC<DocumentControlProps> = ({ projectId }) => {
   const { getProjectDocs } = useData();
   const docs = getProjectDocs(projectId);
   const theme = useTheme();
   const { hasPermission } = usePermissions();
   const canUpload = hasPermission('project:edit'); // Mapping upload to edit permission for now

   const getIcon = (type: string) => {
      switch (type) {
         case 'PDF': return <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">PDF</div>;
         case 'XLSX': return <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">XLS</div>;
         case 'DWG': return <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">DWG</div>;
         default: return <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">DOC</div>;
      }
   };

   return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
         <div className={theme.layout.header}>
            <div>
               <h1 className={theme.typography.h1}>
                  <Folder className="text-nexus-500" /> Document Control
               </h1>
               <p className={theme.typography.small}>Central repository for all project specifications, drawings, and reports.</p>
            </div>
            {canUpload ? (
               <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
                  <Upload size={16} /> <span className="hidden sm:inline">Upload Document</span>
               </button>
            ) : (
               <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                  <Lock size={14} /> Upload Restricted
               </div>
            )}
         </div>

         <div className={theme.layout.panelContainer}>
            {/* Toolbar */}
            <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background} flex flex-col md:flex-row justify-between items-center gap-4`}>
               <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Search files..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50">
                     <Sliders size={14} /> Filter
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

            {/* Grid View */}
            <div className="flex-1 overflow-auto p-6">
               <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Recent Uploads</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {docs.map(doc => (
                     <div key={doc.id} className={`p-4 border ${theme.colors.border} rounded-lg hover:border-nexus-300 hover:shadow-md transition-all ${theme.colors.surface} group cursor-pointer relative`}>
                        <div className="flex justify-between items-start mb-3">
                           {getIcon(doc.type)}
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
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
                           <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${doc.status === 'Final' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                              {doc.status}
                           </span>
                        </div>
                     </div>
                  ))}

                  {/* Upload Placeholder */}
                  {canUpload && (
                     <div className={`border-2 border-dashed ${theme.colors.border} rounded-lg flex flex-col items-center justify-center p-6 text-slate-400 hover:border-nexus-400 hover:text-nexus-500 hover:bg-nexus-50/30 transition-all cursor-pointer h-[140px]`}>
                        <Upload size={24} className="mb-2 opacity-50" />
                        <span className="text-sm font-medium">Drop files here</span>
                     </div>
                  )}
               </div>

               <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Folders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {['Specifications', 'Contracts', 'RFI Responses', 'Safety Reports', 'Photos'].map((folder, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 border ${theme.colors.border} rounded-lg hover:bg-slate-50 cursor-pointer`}>
                           <Folder className="text-yellow-400" size={24} />
                           <span className="text-sm font-medium text-slate-700">{folder}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DocumentControl;
