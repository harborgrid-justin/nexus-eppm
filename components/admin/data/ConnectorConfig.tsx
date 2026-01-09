
import React from 'react';
import { Network, Plus, Settings, RefreshCw, Save, Key, Globe, Database, Server, Link, Activity } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { SidePanel } from '../../ui/SidePanel';
import { Input } from '../../ui/Input';
import { useConnectorConfigLogic } from '../../../hooks/domain/useConnectorConfigLogic';

export const ConnectorConfig: React.FC = () => {
    const theme = useTheme();
    const {
        integrations,
        isPanelOpen,
        setIsPanelOpen,
        editingConn,
        setEditingConn,
        isTesting,
        handleOpen,
        handleSave,
        handleTestConnection,
        handleSync
    } = useConnectorConfigLogic();

    const getIcon = (type: string) => {
        switch(type) {
            case 'ERP': return Database;
            case 'Schedule': return Server;
            case 'Document': return Link;
            default: return Globe;
        }
    };

    const getStatusIndicator = (health: string | undefined) => {
        if (health === 'Good') return `bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]`;
        if (health === 'Warning') return `bg-yellow-500`;
        if (health === 'Critical') return `bg-red-500`;
        return `bg-slate-300`;
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                        <Network size={24} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${theme.colors.text.primary} text-lg`}>System Connectors</h3>
                        <p className={`text-sm ${theme.colors.text.secondary}`}>Manage API endpoints, authentication, and sync intervals.</p>
                    </div>
                </div>
                <Button icon={Plus} onClick={() => handleOpen(null)}>Add Connector</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4 px-1">
                {integrations.map(conn => {
                    const Icon = getIcon(conn.type);
                    return (
                        <div key={conn.id} className={`${theme.components.card} p-6 group hover:border-nexus-300 transition-all flex flex-col`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} ${theme.colors.text.secondary} group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-colors`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusIndicator(conn.health)}`}></div>
                                </div>
                            </div>
                            
                            <h4 className={`font-bold ${theme.colors.text.primary} text-lg mb-1`}>{conn.name}</h4>
                            <p className={`text-xs ${theme.colors.text.secondary} font-mono truncate mb-4`}>{conn.endpoint || 'No Endpoint Configured'}</p>
                            
                            <div className="flex gap-2 mb-6">
                                 <span className={`text-[10px] font-bold ${theme.colors.background} ${theme.colors.text.tertiary} px-2 py-1 rounded border ${theme.colors.border} uppercase`}>{conn.type}</span>
                                 <span className={`text-[10px] font-bold ${theme.colors.background} ${theme.colors.text.tertiary} px-2 py-1 rounded border ${theme.colors.border} uppercase`}>{conn.protocol || 'REST'}</span>
                                 <span className={`text-[10px] font-bold ${theme.colors.background} ${theme.colors.text.secondary} px-2 py-1 rounded border ${theme.colors.border} uppercase ml-auto`}>{conn.lastSync}</span>
                            </div>

                            <div className={`mt-auto pt-4 border-t ${theme.colors.border.replace('border-','border-slate-')}100 flex gap-2`}>
                                <button onClick={() => handleOpen(conn)} className={`flex-1 py-2 border ${theme.colors.border} rounded-lg text-xs font-bold ${theme.colors.text.tertiary} hover:${theme.colors.background} flex items-center justify-center gap-2 transition-colors`}>
                                    <Settings size={14}/> Configure
                                </button>
                                <button 
                                    onClick={() => handleSync(conn)}
                                    className={`flex-1 py-2 border ${theme.colors.border} rounded-lg text-xs font-bold ${theme.colors.text.tertiary} hover:${theme.colors.background} flex items-center justify-center gap-2 transition-colors`}
                                >
                                    <RefreshCw size={14} className={conn.lastSync === 'Syncing...' ? 'animate-spin' : ''}/> Sync Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingConn?.id ? "Configure Connector" : "New Connection"}
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Save Connection</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Connector Name</label>
                        <Input value={editingConn?.name} onChange={e => setEditingConn({...editingConn, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Type</label>
                            <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`} value={editingConn?.type} onChange={e => setEditingConn({...editingConn, type: e.target.value})}>
                                <option>ERP</option>
                                <option>Schedule</option>
                                <option>CRM</option>
                                <option>Document</option>
                                <option>Data</option>
                            </select>
                        </div>
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Protocol</label>
                            <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`} value={editingConn?.protocol} onChange={e => setEditingConn({...editingConn, protocol: e.target.value as any})}>
                                <option>REST API</option>
                                <option>SOAP / WSDL</option>
                                <option>OData</option>
                                <option>OData v4</option>
                                <option>JDBC</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Endpoint URL</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <Input className="pl-9 font-mono text-xs" value={editingConn?.endpoint} onChange={e => setEditingConn({...editingConn, endpoint: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                        <h4 className={`text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest mb-3 flex items-center gap-2`}>
                            <Key size={14}/> Authentication
                        </h4>
                        <div className="space-y-3">
                             <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} mb-2 ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`}>
                                <option>OAuth 2.0 (Client Creds)</option>
                                <option>Basic Auth</option>
                                <option>API Key</option>
                            </select>
                            <Input type="password" placeholder="Client ID / Username" />
                            <Input type="password" placeholder="Client Secret / Key" />
                        </div>
                    </div>

                    <Button 
                        variant="secondary" 
                        className={`w-full ${isTesting ? `${theme.colors.semantic.warning.bg} ${theme.colors.semantic.warning.text} ${theme.colors.semantic.warning.border}` : ''}`} 
                        onClick={handleTestConnection}
                        disabled={isTesting}
                    >
                        {isTesting ? <RefreshCw className="animate-spin mr-2 h-4 w-4"/> : <Activity className="mr-2 h-4 w-4"/>}
                        {isTesting ? "Handshaking..." : "Test Connectivity"}
                    </Button>
                </div>
            </SidePanel>
        </div>
    );
};
