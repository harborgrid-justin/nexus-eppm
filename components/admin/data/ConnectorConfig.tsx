
import React from 'react';
import { Network, Plus, Settings, RefreshCw, Save, Key, Globe, Database, Server, Link, Activity } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { SidePanel } from '../../ui/SidePanel';
import { Input } from '../../ui/Input';
import { useConnectorConfigLogic } from '../../../hooks/domain/useConnectorConfigLogic';
import { EmptyGrid } from '../../common/EmptyGrid';

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
        <div className="h-full flex flex-col space-y-6 p-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${theme.colors.surface} p-6 rounded-2xl border ${theme.colors.border} shadow-sm gap-4`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                        <Network size={24} />
                    </div>
                    <div>
                        <h3 className={`font-black ${theme.colors.text.primary} text-lg uppercase tracking-tighter`}>Enterprise Connectors</h3>
                        <p className={`text-sm ${theme.colors.text.secondary} font-medium`}>Manage API endpoints and global sync intervals.</p>
                    </div>
                </div>
                <Button icon={Plus} onClick={() => handleOpen(null)} className="shadow-lg shadow-nexus-500/10 font-bold uppercase tracking-widest text-[10px]">Add Connector</Button>
            </div>

            {integrations.length === 0 ? (
                <div className="flex-1">
                    <EmptyGrid 
                        title="Infrastructure Fabric Clean"
                        description="No external data connectors are currently provisioned."
                        onAdd={() => handleOpen(null)}
                        actionLabel="Provision Connector"
                        icon={Network}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-12 px-1">
                    {integrations.map(conn => {
                        const Icon = getIcon(conn.type);
                        return (
                            <div key={conn.id} className={`${theme.components.card} p-6 group hover:border-nexus-300 transition-all flex flex-col shadow-sm`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 ${theme.colors.background} rounded-xl border ${theme.colors.border} ${theme.colors.text.tertiary} group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-colors shadow-inner`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusIndicator(conn.health)}`}></div>
                                    </div>
                                </div>
                                
                                <h4 className={`font-black ${theme.colors.text.primary} text-lg mb-1 uppercase tracking-tight`}>{conn.name}</h4>
                                <p className={`text-[10px] ${theme.colors.text.secondary} font-mono truncate mb-6 bg-slate-50 p-1.5 rounded border border-slate-100`}>{conn.endpoint || 'ENDPOINT_NOT_CONFIGURED'}</p>
                                
                                <div className="flex gap-2 mb-8 flex-wrap">
                                    <span className={`text-[9px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border} tracking-tighter`}>{conn.type}</span>
                                    <span className={`text-[9px] font-black uppercase text-nexus-600 bg-nexus-50 px-2 py-1 rounded border border-nexus-100 tracking-tighter ml-auto`}>Last: {conn.lastSync}</span>
                                </div>

                                <div className={`mt-auto pt-4 border-t ${theme.colors.border} flex gap-3`}>
                                    <button onClick={() => handleOpen(conn)} className={`flex-1 py-2.5 bg-white border ${theme.colors.border} rounded-xl text-[10px] font-black uppercase tracking-widest ${theme.colors.text.tertiary} hover:text-nexus-600 hover:border-nexus-200 transition-all shadow-sm active:scale-95`}>
                                        <Settings size={12} className="inline mr-1.5"/> Settings
                                    </button>
                                    <button 
                                        onClick={() => handleSync(conn)}
                                        className={`flex-1 py-2.5 bg-white border ${theme.colors.border} rounded-xl text-[10px] font-black uppercase tracking-widest ${theme.colors.text.tertiary} hover:text-nexus-600 hover:border-nexus-200 transition-all shadow-sm active:scale-95`}
                                    >
                                        <RefreshCw size={12} className={`inline mr-1.5 ${conn.lastSync === 'Syncing...' ? 'animate-spin' : ''}`}/> Sync Now
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
                title={editingConn?.id ? "Configure System Connector" : "Provision New Endpoint"}
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Endpoint</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-1.5 ml-1`}>Entity Label</label>
                        <Input value={editingConn?.name} onChange={e => setEditingConn({...editingConn!, name: e.target.value})} placeholder="e.g. Master Financial ERP" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-1.5 ml-1`}>Topology Type</label>
                            <select className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold ${theme.colors.background} focus:ring-2 focus:ring-nexus-500 outline-none transition-colors`} value={editingConn?.type} onChange={e => setEditingConn({...editingConn!, type: e.target.value})}>
                                <option>ERP</option>
                                <option>Schedule</option>
                                <option>CRM</option>
                            </select>
                        </div>
                    </div>
                    <Button 
                        variant="secondary" 
                        className={`w-full h-12 shadow-sm ${isTesting ? 'animate-pulse' : ''}`} 
                        onClick={handleTestConnection}
                        disabled={isTesting}
                    >
                        {isTesting ? <RefreshCw className="animate-spin mr-2 h-4 w-4"/> : <Activity className="mr-2 h-4 w-4 text-nexus-500"/>}
                        {isTesting ? "Validating Perimeter..." : "Test Connection Integrity"}
                    </Button>
                </div>
            </SidePanel>
        </div>
    );
};
