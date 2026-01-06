import React from 'react';
import { useData } from '../context/DataContext';
import { Network, RefreshCw, CheckCircle2, XCircle, Settings, Power, Plus, Server } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PageHeader } from './common/PageHeader';
import { EmptyGrid } from './common/EmptyGrid';

const IntegrationHub: React.FC = () => {
  const { state, dispatch } = useData();

  const handleAddConnector = () => {
      dispatch({ 
        type: 'SYSTEM_ADD_INTEGRATION', 
        payload: { 
            id: `INT-${Date.now()}`, 
            name: 'New Core Connector', 
            type: 'System', 
            status: 'Disconnected', 
            lastSync: 'Never', 
            logo: 'Network' 
        } 
      });
  };

  return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)] h-full flex flex-col">
       <PageHeader 
          title="Integration Hub" 
          subtitle="Manage secure connections to external enterprise data ecosystems." 
          icon={Network} 
          actions={<Button variant="secondary" icon={RefreshCw} size="sm">Poll All Nodes</Button>}
       />

      <ErrorBoundary name="Integration Ledger">
        {state.integrations.length === 0 ? (
            <EmptyGrid 
                title="No Connectors Defined" 
                description="Initialize your enterprise fabric by bridging external ERP or BIM data sources."
                onAdd={handleAddConnector}
                actionLabel="Bridge Endpoint"
                icon={Server}
            />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)] animate-nexus-in">
                {state.integrations.map((integration) => (
                    <Card key={integration.id} className="p-6 relative group flex flex-col h-full hover:border-nexus-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-100 shadow-inner">
                                {typeof integration.logo === 'string' ? <Network size={24} className="opacity-40"/> : integration.logo}
                            </div>
                            <Badge 
                                variant={integration.status === 'Connected' || integration.status === 'Active' ? 'success' : 'neutral'}
                                icon={integration.status === 'Connected' || integration.status === 'Active' ? CheckCircle2 : XCircle}
                            >
                                {String(integration.status)}
                            </Badge>
                        </div>
                        
                        <h3 className="text-base font-black text-slate-900 tracking-tight">{String(integration.name)}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{String(integration.type)} Endpoint</p>
                        
                        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Last Handshake: {String(integration.lastSync)}</span>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="p-2" aria-label="Endpoint Settings"><Settings size={14} /></Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className={(integration.status === 'Connected' || integration.status === 'Active') ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                                    onClick={() => dispatch({ type: 'SYSTEM_TOGGLE_INTEGRATION', payload: integration.id })}
                                >
                                    <Power size={14} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                <button 
                    onClick={handleAddConnector}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-nexus-300 hover:bg-white transition-all cursor-pointer min-h-[200px] group shadow-sm hover:shadow-md"
                >
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus size={24} className="opacity-50" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Provision Connector</h3>
                    <p className="text-[10px] mt-1 font-medium opacity-70">Expand Enterprise Graph</p>
                </button>
            </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default IntegrationHub;