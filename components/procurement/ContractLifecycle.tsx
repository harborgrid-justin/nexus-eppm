
import React from 'react';
import { useProcurementData } from '../../hooks';
import { Plus, FileText, AlertOctagon, Lock, FileSignature } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { usePermissions } from '../../hooks/usePermissions';
import { EmptyGrid } from '../common/EmptyGrid';

interface ContractLifecycleProps {
  projectId: string;
}

const ContractLifecycle: React.FC<ContractLifecycleProps> = ({ projectId }) => {
  const { projectContracts, vendors, projectClaims } = useProcurementData(projectId);
  const theme = useTheme();
  const { hasPermission } = usePermissions();
  const canEditProcurement = hasPermission('financials:write');

  const handleCreateContract = () => {
      // In real app, open modal
      console.log("Create contract");
  };

  return (
    <div className="h-full flex flex-col">
       <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50 flex justify-between items-center`}>
            <h3 className={`font-semibold ${theme.colors.text.primary} flex items-center gap-2`}>
                <FileText size={16} className="text-nexus-600"/> Contract Repository
            </h3>
            {canEditProcurement ? (
                <button 
                    onClick={handleCreateContract}
                    className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-medium flex items-center gap-2 ${theme.colors.primaryHover} shadow-sm`}
                >
                    <Plus size={16}/> <span className="hidden sm:inline">Create Contract</span>
                </button>
            ) : (
                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                    <Lock size={14}/> Read Only
                </div>
            )}
        </div>
        <div className={`flex-1 overflow-auto ${theme.layout.pagePadding} space-y-4`}>
            {projectContracts.length > 0 ? projectContracts.map(contract => {
                const vendor = vendors.find(v => v.id === contract.vendorId);
                const claims = projectClaims.filter(c => c.contractId === contract.id);
                
                return (
                    <div 
                        key={contract.id} 
                        className={`${theme.components.card} p-6 hover:shadow-md transition-all group focus-within:ring-2 focus-within:ring-nexus-500`}
                        tabIndex={0}
                        role="article"
                        aria-label={`Contract: ${contract.title}`}
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                            <div>
                                <h4 className={`text-lg font-bold ${theme.colors.text.primary} flex items-center gap-2 group-hover:text-nexus-600 transition-colors`}>
                                    {contract.title}
                                </h4>
                                <p className={`text-sm ${theme.colors.text.secondary} mt-1`}>Vendor: <span className={`font-medium ${theme.colors.text.primary}`}>{vendor?.name || contract.vendorId}</span> • Type: {contract.type}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${contract.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                {contract.status}
                            </span>
                        </div>
                        
                        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm pt-4 border-t ${theme.colors.border}`}>
                            <div>
                                <p className={`${theme.colors.text.tertiary} text-xs uppercase tracking-wide font-semibold mb-1`}>Contract Value</p>
                                <p className={`font-bold ${theme.colors.text.primary} text-lg`}>{formatCurrency(contract.contractValue)}</p>
                            </div>
                            <div>
                                <p className={`${theme.colors.text.tertiary} text-xs uppercase tracking-wide font-semibold mb-1`}>Start Date</p>
                                <p className={`font-medium ${theme.colors.text.primary}`}>{formatDate(contract.startDate)}</p>
                            </div>
                            <div>
                                <p className={`${theme.colors.text.tertiary} text-xs uppercase tracking-wide font-semibold mb-1`}>End Date</p>
                                <p className={`font-medium ${theme.colors.text.primary}`}>{formatDate(contract.endDate)}</p>
                            </div>
                            <div>
                                <p className={`${theme.colors.text.tertiary} text-xs uppercase tracking-wide font-semibold mb-1`}>Claims</p>
                                <p className={`font-bold ${claims.length > 0 ? 'text-red-600' : theme.colors.text.primary}`}>{claims.length} Active</p>
                            </div>
                        </div>

                        {claims.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-4 animate-in fade-in slide-in-from-top-2">
                                <h5 className="text-xs font-bold text-red-800 uppercase mb-2 flex items-center gap-1"><AlertOctagon size={12}/> Open Claims</h5>
                                {claims.map(claim => (
                                    <div key={claim.id} className="flex justify-between text-sm text-red-900 mb-1 last:mb-0 pl-4 border-l-2 border-red-200">
                                        <span>{claim.title} ({claim.status})</span>
                                        <span className="font-mono font-semibold">{formatCurrency(claim.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }) : (
                <div className="h-full flex flex-col items-center justify-center p-8">
                     <EmptyGrid 
                        title="No Contracts Executed"
                        description="The contract repository is empty. Execute a contract to begin tracking commitments."
                        actionLabel="Create Contract"
                        onAdd={canEditProcurement ? handleCreateContract : undefined}
                        icon={FileSignature}
                     />
                </div>
            )}
        </div>
    </div>
  );
};

export default ContractLifecycle;
