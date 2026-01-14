import React from 'react';
import { Network, Plus, Settings, RefreshCw, Save, Key, Globe, Database, Server, Link, Activity, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { SidePanel } from '../../ui/SidePanel';
import { Input } from '../../ui/Input';
import { useConnectorConfigLogic } from '../../../hooks/domain/useConnectorConfigLogic';
import { EmptyGrid } from '../../common/EmptyGrid';
import { Badge } from '../../ui/Badge';

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
        if (health === 'Good') return `bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.5)]`;
        if (health === 'Warning') return `bg-yellow-500`;
        if (health === 'Critical') return `bg-red-500`;
        return `bg-slate-300`;
    };

    return (
        <div className="h-full flex flex-col space-y-8 p-10 animate-in fade-in duration-500 scrollbar-thin">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.surface} p-8 rounded-[2rem] border ${theme.colors.border} shadow-sm gap-6 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-12 bg-nexus-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-nexus-500/10 transition-colors"></div>
                <div className="flex items-center gap-5 relative z-10">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20">
                        <Network size={28} />
                    </div>
                    <div>
                        <h3 className={`font-black ${theme.colors.text.primary} text-2xl uppercase tracking-tighter`}>Infrastructure Grid</h3>
                        <p className={`text-sm ${theme.colors.text.secondary} font-medium mt-1`}>Manage authoritative API endpoints and global socket synchronization.</p>
                    </div>
                </div>
                <Button icon={Plus} onClick={() => handleOpen(null)} className="shadow-2xl shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-12 px-8 relative z-10">Add Strategic Connector</Button>
            </div>

            {integrations.length === 0 ? (
                <div className="flex-1">
                    <EmptyGrid 
                        title="Infrastructure Fabric Null"
                        description="No external enterprise data connectors are currently provisioned in this tenant environment."
                        onAdd={() => handleOpen(null)}
                        actionLabel="Provision System Connector"
                        icon={Network}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-y-auto pb-20 px-1 scrollbar-thin">
                    {integrations.map(conn => {
                        const Icon = getIcon(conn.type);
                        return (
                            <div key={conn.id} className={`${theme.components.card} p-8 group hover:border-nexus-400 transition-all flex flex-col shadow-sm rounded-[2.5rem] bg-white relative overflow-hidden`}>
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-nexus-500 transition-colors"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 ${theme.colors.background} rounded-2xl border ${theme.colors.border} ${theme.colors.text.tertiary} group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-all shadow-inner group-hover:scale-110`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={conn.health === 'Good' ? 'success' : 'neutral'}>{conn.health || 'UNKNOWN'}</Badge>
                                        <div className={`w-3 h-3 rounded-full ${getStatusIndicator(conn.health)}`}></div>
                                    </div>
                                </div>
                                
                                <h4 className={`font-black ${theme.colors.text.primary} text-lg mb-1 uppercase tracking-tight`}>{conn.name}</h4>
                                <p className={`text-[10px] ${theme.colors.text.tertiary} font-mono truncate mb-8 bg-slate-50 p-2.5 rounded-xl border border-slate-100 uppercase tracking-tighter`}>{conn.endpoint || 'NULL_ENDPOINT_AUTH_REQ'}</p>
                                
                                <div className="flex gap-2 mb-10 flex-wrap">
                                    <span className={`text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 tracking-tight`}>{conn.type} GATEWAY</span>
                                    <span className={`text-[10px] font-black uppercase text-nexus-600 bg-nexus-50 px-3 py-1 rounded-lg border border-nexus-100 tracking-tight ml-auto`}>Synced: {conn.lastSync}</span>
                                </div>

                                <div className={`mt-auto pt-6 border-t ${theme.colors.border} flex gap-4`}>
                                    <button onClick={() => handleOpen(conn)} className={`flex-1 py-3 bg-white border ${theme.colors.border} rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-nexus-600 hover:border-nexus-300 transition-all shadow-sm active:scale-95`}>
                                        <Settings size={14} className="inline mr-2"/> Configuration
                                    </button>
                                    <button 
                                        onClick={() => handleSync(conn)}
                                        disabled={conn.lastSync === 'Syncing...'}
                                        className={`flex-1 py-3 bg-white border ${theme.colors.border} rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-nexus-600 hover:border-nexus-300 transition-all shadow-sm active:scale-95 disabled:opacity-50`}
                                    >
                                        <RefreshCw size={14} className={`inline mr-2 ${conn.lastSync === 'Syncing...' ? 'animate-spin' : ''}`}/> Sync Cycle
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingConn?.id ? "Entity Endpoint Configuration" : "Provision New Strategic Endpoint"}
                width="md:w-[550px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save} className="shadow-lg shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] px-8 h-12">Commit Endpoint</Button>
                    </>
                }
            >
                <div className="space-y-10 animate-nexus-in">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                             <ShieldCheck size={18} className="text-nexus-600"/>
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata Designation</h4>
                        </div>
                        <Input 
                            label="Operational Alias" 
                            value={editingConn?.name} 
                            onChange={e => setEditingConn({...editingConn!, name: e.target.value})} 
                            placeholder="e.g. Master S/4HANA Ledger" 
                            className="font-black text-slate-800"
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-1.5 ml-1`}>Network Topology</label>
                                <select className={`w-full p-3.5 border ${theme.colors.border} rounded-xl text-sm font-black bg-slate-50 focus:ring-4 focus:ring-nexus-500/10 focus:bg-white outline-none transition-all text-slate-700`} value={editingConn?.type} onChange={e => setEditingConn({...editingConn!, type: e.target.value})}>
                                    <option>ERP Gateway</option>
                                    <option>Scheduling Engine</option>
                                    <option>CRM Ingestion</option>
                                    <option>Document Store</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-1.5 ml-1`}>Security Protocol</label>
                                <Input value={editingConn?.protocol || 'OAuth 2.0 / TLS 1.3'} disabled className="bg-slate-100 font-mono text-[10px] font-black" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                         <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-nexus-400 relative z-10">Handshake Validation</h4>
                         <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">Conduct a perimeter sanity check before committing the endpoint to the organizational production fabric.</p>
                         <Button 
                            variant="secondary" 
                            className={`w-full h-14 shadow-xl font-black uppercase tracking-[0.15em] text-xs transition-all relative z-10 ${isTesting ? 'animate-pulse' : ''}`} 
                            onClick={handleTestConnection}
                            disabled={isTesting}
                        >
                            {isTesting ? <RefreshCw className="animate-spin mr-3 h-5 w-5"/> : <Activity className="mr-3 h-5 w-5 text-nexus-500"/>}
                            {isTesting ? "Analyzing Perimeter..." : "Test Connection Integrity"}
                        </Button>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};