
import React, { useState } from 'react';
import { Network, Plus, Check, Settings, Trash2, Key, Globe, Database, Server, Link, Activity, RefreshCw, Save, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { SidePanel } from '../../ui/SidePanel';
import { Input } from '../../ui/Input';
import { MOCK_CONNECTORS } from '../../../constants/index';

export const ConnectorConfig: React.FC = () => {
    const theme = useTheme();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingConn, setEditingConn] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);

    const handleOpen = (conn: any) => {
        setEditingConn(conn || { name: '', type: 'ERP', protocol: 'REST', endpoint: '' });
        setIsPanelOpen(true);
    };

    const handleTestConnection = () => {
        setIsTesting(true);
        setTimeout(() => {
            setIsTesting(false);
            alert("Connection Successful! Latency: 45ms");
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                        <Network size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">System Connectors</h3>
                        <p className="text-sm text-slate-500">Manage API endpoints, authentication, and sync intervals.</p>
                    </div>
                </div>
                <Button icon={Plus} onClick={() => handleOpen(null)}>Add Connector</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-4 px-1">
                {MOCK_CONNECTORS.map(conn => (
                    <div key={conn.id} className={`${theme.components.card} p-6 group hover:border-nexus-300 transition-all flex flex-col`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-colors">
                                <conn.icon size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                                {conn.health === 'Good' && <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>}
                                {conn.health === 'Warning' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>}
                                {conn.health === 'Critical' && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                            </div>
                        </div>
                        
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{conn.name}</h4>
                        <p className="text-xs text-slate-500 font-mono truncate mb-4">{conn.endpoint}</p>
                        
                        <div className="flex gap-2 mb-6">
                             <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase">{conn.type}</span>
                             <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 uppercase">{conn.protocol}</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                            <button onClick={() => handleOpen(conn)} className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                                <Settings size={14}/> Configure
                            </button>
                            <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                                <RefreshCw size={14}/> Sync Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingConn?.id ? "Configure Connector" : "New Connection"}
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsPanelOpen(false)} icon={Save}>Save Connection</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Connector Name</label>
                        <Input value={editingConn?.name} onChange={e => setEditingConn({...editingConn, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Type</label>
                            <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" value={editingConn?.type}>
                                <option>ERP</option>
                                <option>Schedule</option>
                                <option>CRM</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Protocol</label>
                            <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" value={editingConn?.protocol}>
                                <option>REST API</option>
                                <option>SOAP / WSDL</option>
                                <option>OData</option>
                                <option>JDBC (Direct DB)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Endpoint URL</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <Input className="pl-9 font-mono text-xs" value={editingConn?.endpoint} />
                        </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Key size={14}/> Authentication
                        </h4>
                        <div className="space-y-3">
                             <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white mb-2">
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
                        className={`w-full ${isTesting ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}`} 
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
