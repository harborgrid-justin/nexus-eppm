import React from 'react';
import { useData } from '../context/DataContext';
import { Network, RefreshCw, CheckCircle2, XCircle, Settings, Power } from 'lucide-react';

const IntegrationHub: React.FC = () => {
  const { state, dispatch } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Network className="text-nexus-600" /> Integration Hub
            </h1>
            <p className="text-slate-500">Manage connections to external enterprise systems.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm text-sm font-medium">
             <RefreshCw size={16} /> Sync All
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.integrations.map((integration) => (
             <div key={integration.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-100">
                      {integration.logo}
                   </div>
                   <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      integration.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                   }`}>
                      {integration.status === 'Connected' ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                      {integration.status}
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900">{integration.name}</h3>
                <p className="text-sm text-slate-500 mb-6">{integration.type} Platform</p>
                
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-xs text-slate-400">Last synced: {integration.lastSync}</span>
                   <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-nexus-600 bg-slate-50 rounded-lg">
                         <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => dispatch({ type: 'TOGGLE_INTEGRATION', payload: integration.id })}
                        className={`p-2 rounded-lg transition-colors ${
                           integration.status === 'Connected' 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-green-500 hover:bg-green-50'
                        }`}
                      >
                         <Power size={16} />
                      </button>
                   </div>
                </div>
             </div>
          ))}

          {/* Scaffold placeholders for "80 features" expansion */}
          {[...Array(2)].map((_, i) => (
             <div key={i} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-nexus-300 hover:bg-nexus-50/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                   <Network size={20} className="opacity-50" />
                </div>
                <h3 className="text-sm font-semibold">Add New Connector</h3>
                <p className="text-xs mt-1">Explore 50+ additional integrations</p>
             </div>
          ))}
       </div>
    </div>
  );
};

export default IntegrationHub;
