
import React, { useState, useMemo, useDeferredValue } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { AlertOctagon, ArrowUpRight, CheckCircle, Plus, Edit2, Trash2, Search, ShieldAlert, Activity, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProgramIssue } from '../../types';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramIssuesProps {
  programId: string;
}

const ProgramIssues: React.FC<ProgramIssuesProps> = ({ programId }) => {
  const { programIssues, projects } = useProgramData(programId);
  const { dispatch, state } = useData();
  const theme = useTheme();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [currentIssue, setCurrentIssue] = useState<Partial<ProgramIssue>>({
      title: '', description: '', priority: 'Medium', status: 'Open',
      ownerId: '', resolutionPath: '', impactedProjectIds: []
  });

  const handleOpenPanel = (issue?: ProgramIssue) => {
      setCurrentIssue(issue || {
          title: '', description: '', priority: 'Medium', status: 'Open',
          ownerId: '', resolutionPath: '', impactedProjectIds: []
      });
      setIsPanelOpen(true);
  };

  const handleSave = () => {
      if (!currentIssue.title || !currentIssue.description) return;

      const issueToSave: ProgramIssue = {
          id: currentIssue.id || generateId('PI'),
          programId,
          title: currentIssue.title,
          description: currentIssue.description,
          priority: currentIssue.priority || 'Medium',
          status: currentIssue.status || 'Open',
          ownerId: currentIssue.ownerId || 'Unassigned',
          resolutionPath: currentIssue.resolutionPath || '',
          impactedProjectIds: currentIssue.impactedProjectIds || []
      };

      dispatch({ type: 'PROGRAM_UPDATE_ISSUE', payload: issueToSave });
      setIsPanelOpen(false);
  };

  const filteredIssues = useMemo(() => {
      return programIssues.filter(issue => {
          const matchesSearch = issue.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
                                issue.description.toLowerCase().includes(deferredSearchTerm.toLowerCase());
          const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
          return matchesSearch && matchesStatus;
      });
  }, [programIssues, deferredSearchTerm, filterStatus]);

  const escalationPath = useMemo(() => {
      const roles = state.governanceRoles.filter(r => r.programId === programId).sort((a,b) => 
        (a.authorityLevel === 'High' ? 1 : 0) - (b.authorityLevel === 'High' ? 1 : 0)
      );
      return roles.length > 0 ? roles : [{ role: 'Program Manager', responsibilities: 'Standard tactical resolution' }];
  }, [state.governanceRoles, programId]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 text-white rounded-2xl shadow-xl shadow-red-500/20 animate-pulse"><AlertOctagon size={24}/></div>
                <div>
                    <h2 className={theme.typography.h2}>Program Issues & Impediments</h2>
                    <p className={theme.typography.small}>Strategic escalations and cross-project blockers requiring executive intervention.</p>
                </div>
            </div>
            <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()}>Record Impediment</Button>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className="lg:col-span-2 space-y-4">
                <div className={`flex gap-4 items-center bg-white p-3 rounded-2xl border ${theme.colors.border} shadow-sm mb-6`}>
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Filter issue registry..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full text-sm border-0 focus:ring-0 outline-none bg-transparent font-medium`}
                        />
                    </div>
                    <div className={`h-6 w-px ${theme.colors.border}`}></div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`text-xs font-black uppercase tracking-widest border-0 bg-transparent focus:ring-0 outline-none cursor-pointer text-slate-500`}
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Escalated">Escalated</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                {filteredIssues.map(issue => (
                    <div key={issue.id} className={`bg-white p-6 rounded-[2rem] border-l-8 shadow-sm transition-all group relative border-y border-r ${theme.colors.border} hover:border-nexus-300 ${
                        issue.priority === 'Critical' ? 'border-l-red-500' : issue.priority === 'High' ? 'border-l-orange-500' : 'border-l-yellow-400'
                    }`}>
                        <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenPanel(issue)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-nexus-600 transition-colors"><Edit2 size={14}/></button>
                            <button onClick={() => dispatch({type: 'PROGRAM_DELETE_ISSUE', payload: issue.id})} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>

                        <div className="flex justify-between items-start mb-4 pr-16">
                            <div>
                                <h3 className={`font-black ${theme.colors.text.primary} text-lg uppercase tracking-tight leading-tight`}>{issue.title}</h3>
                                <p className={`text-[10px] ${theme.colors.text.tertiary} font-mono font-bold mt-1 uppercase tracking-tighter`}>{issue.id} • Owner: {issue.ownerId}</p>
                            </div>
                            <Badge variant={issue.status === 'Escalated' ? 'danger' : issue.status === 'Resolved' ? 'success' : 'warning'}>{issue.status}</Badge>
                        </div>
                        
                        <p className={`text-sm ${theme.colors.text.secondary} leading-relaxed font-medium mb-6`}>{issue.description}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                            <ShieldAlert size={16} className="text-slate-400 mt-0.5 shrink-0"/> 
                            <div className="min-w-0">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Resolution Strategy</span> 
                                <p className="text-xs text-slate-600 font-bold leading-relaxed">{issue.resolutionPath || 'Tactical resolution pending executive review.'}</p>
                            </div>
                        </div>

                        {issue.impactedProjectIds.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">Blocking:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {issue.impactedProjectIds.map(pid => (
                                        <span key={pid} className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-black rounded-lg border border-red-100">
                                            {projects.find(p => p.id === pid)?.code || pid}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filteredIssues.length === 0 && (
                    <div className="flex items-center justify-center p-8">
                         <EmptyGrid 
                            title={searchTerm ? "Query Resolution Empty" : "System impediments Neutral"}
                            description={searchTerm ? `No active impediments matching "${searchTerm}" found in the program registry.` : "No strategic issues or escalations currently active. Project health is optimal."}
                            icon={AlertOctagon}
                            actionLabel="Record Impediment"
                            onAdd={() => handleOpenPanel()}
                         />
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-8 rounded-[2rem] border ${theme.colors.border} shadow-sm flex flex-col`}>
                    <h3 className={`font-black ${theme.colors.text.primary} text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-slate-50 pb-4`}>
                        <ArrowUpRight size={18} className="text-nexus-600"/> Authorization Hierarchy
                    </h3>
                    <div className="relative pl-6 space-y-10">
                        <div className={`absolute left-1.5 top-2 bottom-2 w-px ${theme.colors.border}`}></div>
                        {escalationPath.map((node, i) => (
                            <div key={i} className="relative group">
                                <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all group-hover:scale-125 ${i === 0 ? 'bg-nexus-500 shadow-nexus-500/20' : 'bg-slate-300'}`}></div>
                                <h4 className={`text-xs font-black uppercase tracking-tight ${i === 0 ? 'text-nexus-700' : 'text-slate-700'}`}>{node.role}</h4>
                                <p className={`text-[10px] ${theme.colors.text.tertiary} leading-relaxed font-bold mt-1`}>{node.responsibilities}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] relative overflow-hidden shadow-sm">
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-green-200 text-green-600 mb-4">
                            <CheckCircle size={24}/>
                        </div>
                        <h4 className="font-black text-green-900 text-xl tracking-tight uppercase">Productivity Flow</h4>
                        <p className="text-xs text-green-700 font-bold uppercase tracking-tight mt-2">{programIssues.filter(i => i.status === 'Resolved').length} Impediments Resolved (MTD)</p>
                    </div>
                    <Activity size={160} className="absolute -right-16 -bottom-16 opacity-5 text-green-800 pointer-events-none rotate-12" />
                </div>
            </div>
        </div>

        <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} width="md:w-[500px]" title={currentIssue.id ? 'Update Impediment' : 'Record New Impediment'}
            footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSave} icon={Save}>Commit Entry</Button></>}>
            <div className="space-y-6">
                <div>
                    <label className={theme.typography.label + " block mb-1.5 ml-1"}>Issue Designation</label>
                    <Input value={currentIssue.title} onChange={(e) => setCurrentIssue({...currentIssue, title: e.target.value})} placeholder="e.g. Data Sovereignty Hold" />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1.5 ml-1"}>Narrative Summary</label>
                    <textarea 
                        className={`w-full p-4 border ${theme.colors.border} rounded-xl text-sm h-32 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none resize-none bg-slate-50/30 transition-all shadow-inner`}
                        value={currentIssue.description} 
                        onChange={e => setCurrentIssue({...currentIssue, description: e.target.value})} 
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className={theme.typography.label + " block mb-1.5 ml-1"}>Priority</label>
                        <select className={`w-full p-3.5 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-white`} value={currentIssue.priority} onChange={(e) => setCurrentIssue({...currentIssue, priority: e.target.value as any})}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
                    </div>
                    <div>
                        <label className={theme.typography.label + " block mb-1.5 ml-1"}>Resolution Lead</label>
                        <Input value={currentIssue.ownerId} onChange={(e) => setCurrentIssue({...currentIssue, ownerId: e.target.value})} placeholder="e.g. R-102" />
                    </div>
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-3 ml-1"}>Impacted Project Partitions</label>
                    <div className={`space-y-2 border ${theme.colors.border} rounded-2xl p-4 bg-slate-50/50 max-h-48 overflow-y-auto scrollbar-thin shadow-inner`}>
                        {projects.map(p => (
                            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${currentIssue.impactedProjectIds?.includes(p.id) ? 'bg-white border-nexus-300 shadow-sm' : 'border-transparent hover:bg-white/50'}`}>
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" 
                                    checked={currentIssue.impactedProjectIds?.includes(p.id)} 
                                    onChange={() => {
                                        const ids = currentIssue.impactedProjectIds || [];
                                        setCurrentIssue({ ...currentIssue, impactedProjectIds: ids.includes(p.id) ? ids.filter(i => i !== p.id) : [...ids, p.id] });
                                    }} 
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-black text-slate-800 uppercase truncate">{p.name}</p>
                                    <p className={`text-[9px] ${theme.colors.text.tertiary} font-mono font-bold mt-0.5`}>{p.code}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramIssues;
