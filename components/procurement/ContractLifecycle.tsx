
import React from 'react';
import { useProcurementData } from '../../hooks/useProcurementData';
import { Plus, FileText, AlertOctagon } from 'lucide-react';

interface ContractLifecycleProps {
  projectId: string;
}

const ContractLifecycle: React.FC<ContractLifecycleProps> = ({ projectId }) => {
  const { projectContracts, vendors, projectClaims } = useProcurementData(projectId);

  return (
    <div className="h-full flex flex-col">
       <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Contract Repository</h3>
            <button className="px-4 py-2 bg-nexus-600 text-white rounded-md text-sm font-medium flex items-center gap-2"><Plus size={14}/> Create Contract</button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-8">
            <div className="space-y-4">
                {projectContracts.map(contract => {
                    const vendor = vendors.find(v => v.id === contract.vendorId);
                    const claims = projectClaims.filter(c => c.contractId === contract.id);
                    
                    return (
                        <div key={contract.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <FileText className="text-nexus-600" size={20}/>
                                        {contract.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 mt-1">Vendor: <span className="font-medium text-slate-700">{vendor?.name || contract.vendorId}</span> • Type: {contract.type}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${contract.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {contract.status}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs">Contract Value</p>
                                    <p className="font-bold text-slate-900">${contract.contractValue.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Start Date</p>
                                    <p className="font-medium text-slate-700">{contract.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">End Date</p>
                                    <p className="font-medium text-slate-700">{contract.endDate}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Claims</p>
                                    <p className={`font-bold ${claims.length > 0 ? 'text-red-600' : 'text-slate-700'}`}>{claims.length} Active</p>
                                </div>
                            </div>

                            {claims.length > 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-4">
                                    <h5 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-1"><AlertOctagon size={12}/> Open Claims</h5>
                                    {claims.map(claim => (
                                        <div key={claim.id} className="flex justify-between text-sm text-red-900 mb-1 last:mb-0">
                                            <span>{claim.title} ({claim.status})</span>
                                            <span className="font-mono">${claim.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default ContractLifecycle;
