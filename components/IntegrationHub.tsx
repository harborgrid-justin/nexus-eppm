
import React from 'react';
import { useData } from '../context/DataContext';
import { Network, RefreshCw, Settings, Power, Plus, Server } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { EmptyGrid } from './common/EmptyGrid';
import { useTheme } from '../context/ThemeContext';
import { generateId } from '../utils/formatters';
import { Integration } from '../types';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';

const IntegrationHub: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();

  const handleAddConnector = () => {
      const newIntegration: Integration = { 
            id: generateId('INT'), 
            name: 'New Core Connector', 
            type: 'System', 
            status: 'Disconnected', 
            lastSync: 'Never', 
            logo: 'Network' 
      };
      dispatch({ 
        type: 'SYSTEM_ADD_INTEGRATION', 
        payload: newIntegration
      });
  };

  const handleToggle = (id: string) => {
      dispatch({ type: 'SYSTEM_TOGGLE_INTEGRATION', payload: id });
  };

  return (
    <PageLayout
        title="Infrastructure Fabric"
        subtitle="Enterprise-grade bi-directional API endpoints and gateway topology."
        icon={Network}
        actions={<Button variant="secondary" icon={RefreshCw} size="sm" onClick={() => window.location.reload()}>Audit All Handshakes</Button>}
    >
        <PanelContainer className="bg-transparent border-0 shadow-none">
            <ErrorBoundary name="Integration Ledger">
                {state.integrations.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-12">
                        <EmptyGrid 
                            title="No System Connectors Defined" 
                            description="Bridge your enterprise S/4HANA or P6 environments to the Nexus ledger to activate real-time telemetry."
                            onAdd={handleAddConnector}
                            actionLabel="Bridge Endpoint"
                            icon={Server}
                        />
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap} animate-nexus-in pb-10`}>
                        {state.integrations.map((integration) => (
                            <Card key={integration.id} className={`p-8 relative group flex flex-col h-full hover:border-nexus-300 transition-all rounded-[2.5rem] shadow-sm ${theme.colors.surface} overflow-hidden border ${theme.colors.border}`}>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                        <Network size={28} className="text-slate-400 group-hover:text-nexus-600 transition-colors" />
                                    </div>
                                    <Badge 
                                        variant={integration.status === 'Connected' || integration.status === 'Active' ? 'success' : 'neutral'}
                                        className="font-black text-[9px] h-7 px-4"
                                    >
                                        {String(integration.status)}
                                    </Badge>
                                </div>
                                
                                <h3 className={`text-xl font-black ${theme.colors.text.primary} tracking-tighter uppercase relative z-10`}>{String(integration.name)}</h3>
                                <p className={`text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 relative z-10`}>{String(integration.type)} GATEWAY</p>
                                
                                <div className={`mt-10 flex items-center justify-between pt-6 border-t ${theme.colors.border} relative z-10`}>
                                    <span className={`text-[9px] font-mono font-black text-slate-400 uppercase`}>SYNC: {String(integration.lastSync)}</span>
                                    <div className="flex gap-2">
                                        <button className={`p-2 text-slate-300 hover:text-nexus-600 hover:bg-slate-50 rounded-xl transition-all`} title="Configure Node"><Settings size={18} /></button>
                                        <button 
                                            className={`p-2 rounded-xl transition-all ${integration.status === 'Connected' ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-green-400 hover:text-green-600 hover:bg-green-50'}`}
                                            onClick={() => handleToggle(integration.id)}
                                            title={integration.status === 'Connected' ? "Disconnect" : "Connect"}
                                        >
                                            <Power size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute inset-0 nexus-empty-pattern opacity-10 -z-0"></div>
                            </Card>
                        ))}

                        <button 
                            onClick={handleAddConnector}
                            className={`border-2 border-dashed ${theme.colors.border} rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center text-slate-400 hover:border-nexus-300 hover:bg-white transition-all cursor-pointer min-h-[240px] group shadow-sm hover:shadow-xl`}
                        >
                            <div className={`w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                                <Plus size={32} className="opacity-50" />
                            </div>
                            <h3 className={`text-xs font-black uppercase tracking-[0.2em]`}>Provision Gateway</h3>
                            <p className="text-[10px] mt-2 font-medium opacity-60">Expand Multi-Tenant Mesh</p>
                        </button>
                    </div>
                )}
            </ErrorBoundary>
        </PanelContainer>
    </PageLayout>
  );
};
export default IntegrationHub;
