
import React from 'react';
import { useData } from '../context/DataContext';
import { Network, RefreshCw, CheckCircle2, XCircle, Settings, Power } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PageHeader } from './common/PageHeader';

const IntegrationHub: React.FC = () => {
  const { state, dispatch } = useData();

  return (
    <div className="p-[var(--spacing-gutter)] space-y-[var(--spacing-gutter)]">
       <PageHeader 
          title="Integration Hub" 
          subtitle="Manage connections to external enterprise systems." 
          icon={Network} 
          actions={<Button variant="secondary" icon={RefreshCw}>Sync All</Button>}
       />

      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
            {state.integrations.map((integration) => (
              <Card key={integration.id} className="p-6 relative group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-100">
                        {integration.logo}
                    </div>
                    <Badge 
                      variant={integration.status === 'Connected' ? 'success' : 'neutral'}
                      icon={integration.status === 'Connected' ? CheckCircle2 : XCircle}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-base font-bold text-text-primary">{integration.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">{integration.type} Platform</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <span className="text-xs text-text-secondary">Last synced: {integration.lastSync}</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="p-2" aria-label="Configure Integration"><Settings size={16} /></Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={integration.status === 'Connected' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                          onClick={() => dispatch({ type: 'SYSTEM_TOGGLE_INTEGRATION', payload: integration.id })}
                          aria-label={integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                        >
                          <Power size={16} />
                        </Button>
                    </div>
                  </div>
              </Card>
            ))}

            {[...Array(2)].map((_, i) => (
              <div 
                key={`placeholder-${i}`} 
                className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-nexus-300 hover:bg-nexus-50/50 transition-all cursor-pointer min-h-[200px]"
                tabIndex={0}
                role="button"
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && alert('Feature coming soon')}
              >
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Network size={20} className="opacity-50" />
                  </div>
                  <h3 className="text-sm font-semibold">Add New Connector</h3>
                  <p className="text-xs mt-1">Explore 50+ pre-built adaptors</p>
              </div>
            ))}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default IntegrationHub;
