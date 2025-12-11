
import React from 'react';
import { useData } from '../context/DataContext';
import { Network, RefreshCw, CheckCircle2, XCircle, Settings, Power } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const IntegrationHub: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <Network className="text-nexus-600" /> Integration Hub
            </h1>
            <p className={theme.typography.small}>Manage connections to external enterprise systems.</p>
          </div>
          <Button variant="secondary" icon={RefreshCw}>Sync All</Button>
       </div>

      <ErrorBoundary>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {state.integrations.map((integration) => (
              <Card key={integration.id} className="p-6 relative group">
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
                  
                  <h3 className={theme.typography.h3}>{integration.name}</h3>
                  <p className={`${theme.typography.body} text-slate-500 mb-6`}>{integration.type} Platform</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-400">Last synced: {integration.lastSync}</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="p-2"><Settings size={16} /></Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={integration.status === 'Connected' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                          onClick={() => dispatch({ type: 'TOGGLE_INTEGRATION', payload: integration.id })}
                        >
                          <Power size={16} />
                        </Button>
                    </div>
                  </div>
              </Card>
            ))}

            {[...Array(2)].map((_, i) => (
              <div key={i} className={`border-2 border-dashed ${theme.colors.border} rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-nexus-300 hover:bg-nexus-50/50 transition-all cursor-pointer`}>
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Network size={20} className="opacity-50" />
                  </div>
                  <h3 className="text-sm font-semibold">Add New Connector</h3>
                  <p className="text-xs mt-1">Explore 50+ additional integrations</p>
              </div>
            ))}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default IntegrationHub;
