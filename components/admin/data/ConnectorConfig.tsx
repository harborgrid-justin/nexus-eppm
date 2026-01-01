
import React from 'react';
import { Network, Plus, Check, Settings, Trash2, Key, Globe, Database, Server, Link, Activity, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// Static configuration moved outside component (Rule 8)
const CONNECTORS = [
    { id: 1, name: 'SAP S/4HANA Finance', type: 'ERP', status: 'Active', protocol: 'OData v4', lastSync: '2m ago', icon: Database, health: 'Good' },
    { id: 2, name: 'Oracle Primavera P6', type: 'Schedule', status: 'Active', protocol: 'SOAP/Web Services', lastSync: '1h ago', icon: Server, health: 'Good' },
    { id: 3, name: 'Microsoft Project Online', type: 'Schedule', status: 'Error', protocol: 'REST API', lastSync: '1d ago', icon: Globe, health: 'Critical' },
    { id: 4, name: 'Autodesk Construction Cloud', type: 'Docs', status: 'Inactive', protocol: 'Forge API', lastSync: '-', icon: Link, health: 'Unknown' },
    { id: 5, name: 'Legacy Mainframe', type: 'Data', status: 'Active', protocol: 'JDBC', lastSync: '4h ago', icon: Server, health: 'Warning' },
];

export const ConnectorConfig: React.FC = () => {
    const theme = useTheme();

    const handleHealthCheck = (id: number) => {
        alert(`Initiating health check handshake for Connector #${id}...`);
    };

    const handleSyncAll = () => {
        alert("Initiating full synchronization across all active connectors...");
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">System Connectors</h3>
                    <p className="text-sm text-slate-500">Manage API keys, endpoints, and authentication capabilities (REST, SOAP, JDBC).</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="secondary" icon={RefreshCw} onClick={handleSyncAll} className="flex-1 sm:flex-none">Sync All</Button>
                    <Button icon={Plus} className="flex-1 sm:flex-none">Add Connector</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4">
                {CONNECTORS.map(conn => (
                    <div key={conn.id} className={`${theme.components.card} p-6 group hover:border-nexus-300 transition-all flex flex-col`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-colors">
                                <conn.icon size={24} />
                            </div>
                            <Badge variant={conn.status === 'Active' ? 'success' : conn.status === 'Error' ? 'danger' : 'neutral'}>
                                {conn.status}
                            </Badge>
                        </div>
                        
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{conn.name}</h4>
                        <div className="flex items-center gap-2 mb-4">
                             <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{conn.protocol}</span>
                             {conn.health === 'Good' && <Activity size={14} className="text-green-500" title="Health: Good"/>}
                             {conn.health === 'Warning' && <Activity size={14} className="text-yellow-500" title="Health: Warning"/>}
                             {conn.health === 'Critical' && <Activity size={14} className="text-red-500" title="Health: Critical"/>}
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-slate-100 mt-auto">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Last Sync:</span>
                                <span className="font-medium text-slate-800">{conn.lastSync}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Auth Type:</span>
                                <span className="font-medium text-slate-800">OAuth 2.0</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Settings size={14}/> Config
                            </button>
                            <button 
                                onClick={() => handleHealthCheck(conn.id)}
                                className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                                title="Run Health Check"
                            >
                                <RefreshCw size={14}/> Test
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-nexus-300 hover:bg-slate-50 transition-all cursor-pointer min-h-[250px]">
                    <Network size={48} className="mb-4 opacity-20"/>
                    <h4 className="font-bold">New Connection</h4>
                    <p className="text-sm text-center mt-1">Select from 50+ pre-built adaptors</p>
                </div>
            </div>
        </div>
    );
};
