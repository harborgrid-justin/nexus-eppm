
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { AlertOctagon, ArrowUpRight, Folder, Shield, CheckCircle, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProgramIssue } from '../../types';
import { generateId } from '../../utils/formatters';

interface ProgramIssuesProps {
  programId: string;
}

const ProgramIssues: React.FC<ProgramIssuesProps> = ({ programId }) => {
  const { programIssues, projects } = useProgramData(programId);
  const { dispatch } = useData();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [currentIssue, setCurrentIssue] = useState<Partial<ProgramIssue>>({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Open',
      owner: '',
      resolutionPath: '',
      impactedProjectIds: []
  });

  const handleOpenModal = (issue?: ProgramIssue) => {
      if (issue) {
          setCurrentIssue({ ...issue });
      } else {
          setCurrentIssue({
              title: '',
              description: '',
              priority: 'Medium',
              status: 'Open',
              owner: '',
              resolutionPath: '',
              impactedProjectIds: []
          });
      }
      setIsModalOpen(true);
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
          owner: currentIssue.owner || 'Unassigned',
          resolutionPath: currentIssue.resolutionPath || '',
          impactedProjectIds: currentIssue.impactedProjectIds || []
      };

      if (currentIssue.id) {
          dispatch({ type: 'UPDATE_PROGRAM_ISSUE', payload: issueToSave });
      } else {
          dispatch({ type: 'ADD_PROGRAM_ISSUE', payload: issueToSave });
      }
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this issue?')) {
          dispatch({ type: 'DELETE_PROGRAM_ISSUE', payload: id });
      }
  };

  const toggleProjectImpact = (projectId: string) => {
      const currentIds = currentIssue.impactedProjectIds || [];
      if (currentIds.includes(projectId)) {
          setCurrentIssue({ ...currentIssue, impactedProjectIds: currentIds.filter(id => id !== projectId) });
      } else {
          setCurrentIssue({ ...currentIssue, impactedProjectIds: [...currentIds, projectId] });
      }
  };

  const filteredIssues = programIssues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
      return matchesSearch && matchesStatus;
  });

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
                <AlertOctagon className="text-red-500" size={24}/>
                <h2 className={theme.typography.h2}>Program Issues & Escalations</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => handleOpenModal()}>Log Issue</Button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="Search issues..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-nexus-500"
                />
            </div>
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400"/>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-nexus-500"
                >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Issue List */}
            <div className="lg:col-span-2 space-y-4">
                {filteredIssues.map(issue => (
                    <div key={issue.id} className={`${theme.colors.surface} p-5 rounded-xl border-l-4 shadow-sm ${
                        issue.priority === 'Critical' ? 'border-l-red-500' : issue.priority === 'High' ? 'border-l-orange-500' : 'border-l-yellow-400'
                    } border-y border-r border-slate-200 group relative`}>
                        
                        {/* Actions */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(issue)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                            <button onClick={() => handleDelete(issue.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>

                        <div className="flex justify-between items-start mb-2 pr-16">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{issue.title}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">{issue.id} • Owner: {issue.owner}</p>
                            </div>
                            <Badge variant={issue.status === 'Escalated' ? 'danger' : issue.status === 'Resolved' ? 'success' : 'warning'}>{issue.status}</Badge>
                        </div>
                        
                        <p className="text-slate-700 text-sm mb-4">{issue.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg w-full border border-slate-100">
                                <Shield size={16} className="text-slate-400"/> 
                                <span className="font-semibold text-slate-700">Resolution Path:</span> 
                                <span className="text-slate-600">{issue.resolutionPath || 'None defined'}</span>
                            </div>
                        </div>

                        {/* Impacted Projects */}
                        {issue.impactedProjectIds.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blocking Projects:</p>
                                <div className="flex flex-wrap gap-2">
                                    {issue.impactedProjectIds.map(pid => {
                                        const proj = projects.find(p => p.id === pid);
                                        return (
                                            <div key={pid} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-md text-sm font-medium">
                                                <Folder size={14}/> {proj?.name || pid}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filteredIssues.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                        <AlertOctagon size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>No issues found matching criteria.</p>
                    </div>
                )}
            </div>

            {/* Governance Sidebar */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ArrowUpRight size={18} className="text-nexus-600"/> Escalation Path
                    </h3>
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-slate-700">Project Manager</h4>
                            <p className="text-xs text-slate-500">Initial logging & local resolution attempt.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-blue-700">Program Manager</h4>
                            <p className="text-xs text-slate-500">Cross-project conflict resolution.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-red-700">Steering Committee</h4>
                            <p className="text-xs text-slate-500">Critical scope/budget/timeline decisions.</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2"><CheckCircle size={16}/> Resolved This Month</h4>
                    <div className="text-center py-4">
                         <span className="text-3xl font-bold text-green-700">{programIssues.filter(i => i.status === 'Resolved').length}</span>
                         <p className="text-xs text-green-800 uppercase font-bold mt-1">Issues Closed</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={currentIssue.id ? 'Edit Issue' : 'Log New Issue'}
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{currentIssue.id ? 'Save Changes' : 'Log Issue'}</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <Input 
                            value={currentIssue.title} 
                            onChange={(e) => setCurrentIssue({...currentIssue, title: e.target.value})}
                            placeholder="Brief issue summary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                        <Input 
                            value={currentIssue.owner} 
                            onChange={(e) => setCurrentIssue({...currentIssue, owner: e.target.value})}
                            placeholder="Person responsible"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500"
                            value={currentIssue.priority}
                            onChange={(e) => setCurrentIssue({...currentIssue, priority: e.target.value})}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500"
                            value={currentIssue.status}
                            onChange={(e) => setCurrentIssue({...currentIssue, status: e.target.value})}
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Escalated</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm h-24 focus:ring-nexus-500 outline-none"
                        value={currentIssue.description}
                        onChange={(e) => setCurrentIssue({...currentIssue, description: e.target.value})}
                        placeholder="Detailed description of the issue..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resolution Path</label>
                    <textarea 
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm h-16 focus:ring-nexus-500 outline-none"
                        value={currentIssue.resolutionPath}
                        onChange={(e) => setCurrentIssue({...currentIssue, resolutionPath: e.target.value})}
                        placeholder="Steps taken or planned to resolve..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Impacted Projects</label>
                    <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto p-2 bg-slate-50">
                        {projects.map(p => (
                            <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                <input 
                                    type="checkbox"
                                    className="rounded text-nexus-600 focus:ring-nexus-500 border-slate-300"
                                    checked={currentIssue.impactedProjectIds?.includes(p.id)}
                                    onChange={() => toggleProjectImpact(p.id)}
                                />
                                <span className="text-sm text-slate-700 font-medium">{p.name}</span>
                                <span className="text-xs text-slate-400 ml-auto">{p.code}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default ProgramIssues;
