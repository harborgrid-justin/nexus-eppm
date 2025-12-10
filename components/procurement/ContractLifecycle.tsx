
import React from 'react';
import { useProcurementData } from '../../hooks/useProcurementData';
import { Plus, FileText, AlertOctagon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ContractLifecycleProps {
  projectId: string;
}

const ContractLifecycle: React.FC<ContractLifecycleProps> = ({ projectId }) => {
  const { projectContracts, vendors, projectClaims } = useProcurementData(projectId);
  const theme = useTheme();

  return (
    <div className="h-full flex flex-col">
       <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50 flex justify-between items-center`}>
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={16} className="text-nexus-600"/> Contract Repository
            </h3>
            <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-nexus-700 shadow-sm`}>
                <Plus size={16}/> Create Contract
            </button>
        </div>
        <div className={`flex-1 overflow-auto ${theme.layout.pagePadding} space-y-4`}>
            {projectContracts.map(contract => {
                const vendor = vendors.find(v => v.id === contract.vendorId);
                const claims = projectClaims.filter(c => c.contractId === contract.id);
                
                return (
                    <div key={contract.id} className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all group`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                                    {contract.title}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1">Vendor: <span className="font-medium text-slate-700">{vendor?.name || contract.vendorId}</span> • Type: {contract.type}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${contract.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                {contract.status}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm pt-4 border-t border-slate-100">
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Contract Value</p>
                                <p className="font-bold text-slate-900 text-lg">${contract.contractValue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Start Date</p>
                                <p className="font-medium text-slate-700">{contract.startDate}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">End Date</p>
                                <p className="font-medium text-slate-700">{contract.endDate}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Claims</p>
                                <p className={`font-bold ${claims.length > 0 ? 'text-red-600' : 'text-slate-700'}`}>{claims.length} Active</p>
                            </div>
                        </div>

                        {claims.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-4 animate-in fade-in slide-in-from-top-2">
                                <h5 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-1"><AlertOctagon size={12}/> Open Claims</h5>
                                {claims.map(claim => (
                                    <div key={claim.id} className="flex justify-between text-sm text-red-900 mb-1 last:mb-0 pl-4 border-l-2 border-red-200">
                                        <span>{claim.title} ({claim.status})</span>
                                        <span className="font-mono font-semibold">${claim.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            
            {projectContracts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>No contracts found for this project.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ContractLifecycle;
