
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { Users, Gavel, Calendar, Clock, Plus, Trash2, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GovernanceRole } from '../../types';
import { generateId } from '../../utils/formatters';

interface ProgramGovernanceProps {
  programId: string;
}

const ProgramGovernance: React.FC<ProgramGovernanceProps> = ({ programId }) => {
  const { governanceRoles, governanceEvents } = useProgramData(programId);
  const { dispatch } = useData();
  const theme = useTheme();
  
  const [isRolePanelOpen, setIsRolePanelOpen] = useState(false);
  const [newRole, setNewRole] = useState<Partial<GovernanceRole>>({
      role: '',
      name: '',
      authorityLevel: 'Medium',
      responsibilities: ''
  });

  const handleAddRole = () => {
      if(newRole.role && newRole.name) {
          dispatch({
              type: 'ADD_GOVERNANCE_ROLE',
              payload: {
                  id: generateId('GR'),
                  programId,
                  role: newRole.role,
                  name: newRole.name,
                  authorityLevel: newRole.authorityLevel || 'Medium',
                  responsibilities: newRole.responsibilities || ''
              } as GovernanceRole
          });
          setIsRolePanelOpen(false);
          setNewRole({ role: '', name: '', authorityLevel: 'Medium', responsibilities: '' });
      }
  };

  const handleDeleteRole = (id: string) => {
      if(confirm("Remove this governance role?")) {
          dispatch({ type: 'DELETE_GOVERNANCE_ROLE', payload: id });
      }
  };

  // Helper to get role by ID
  const sponsor = governanceRoles.find(r => r.role === 'Sponsor');
  const steering = governanceRoles.find(r => r.role === 'Steering Committee');
  const programMgr = governanceRoles.find(r => r.role === 'Program Manager');

  const RoleCard = ({ role, colorClass }: { role: GovernanceRole | undefined, colorClass: string }) => {
      if (!role) return <div className="w-64 h-32 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs">Role Not Assigned</div>;
      return (
        <div className={`p-4 rounded-xl border shadow-sm text-center w-64 flex-shrink-0 ${colorClass} relative group`}>
            <button 
                onClick={() => handleDeleteRole(role.id)} 
                className="absolute top-2 right-2 text-white/50 hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={12}/>
            </button>
            <div className="font-bold text-sm uppercase tracking-wide mb-1 opacity-80">{role.role}</div>
            <div className="font-bold text-lg mb-1">{role.name}</div>
            <div className="text-xs opacity-70 px-2">{role.responsibilities}</div>
        </div>
      );
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <Gavel className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Program Governance & Oversight</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsRolePanelOpen(true)}>Add Role</Button>
        </div>
        <p className="text-slate-500 text-sm mb-6">Established decision-making authority, escalation paths, and approval gates.</p>

        {/* Visual Org Chart */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-8 absolute left-6 top-6 flex items-center gap-2">
                <Users size={18} className="text-blue-500"/> Governance Structure
            </h3>
            
            <div className="w-full overflow-x-auto pb-4">
              <div className="flex flex-col items-center min-w-[800px]">
                <div className="flex gap-12 items-start z-10">
                    {/* Steering Committee (Left Wing) */}
                    <RoleCard role={steering} colorClass="bg-slate-800 text-white border-slate-700" />
                    
                    {/* Sponsor (Top Center) */}
                    <div className="flex flex-col items-center space-y-8">
                        <RoleCard role={sponsor} colorClass="bg-nexus-600 text-white border-nexus-700" />
                        
                        {/* Connector Down */}
                        <div className="h-8 w-0.5 bg-slate-300"></div>
                        
                        <RoleCard role={programMgr} colorClass="bg-white text-slate-800 border-slate-300" />
                    </div>
                </div>
                
                {/* Additional Roles List */}
                <div className="mt-8 w-full max-w-4xl">
                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center border-t border-slate-200 pt-4">Extended Governance Team</h4>
                     <div className="grid grid-cols-3 gap-4">
                         {governanceRoles.filter(r => !['Sponsor', 'Steering Committee', 'Program Manager'].includes(r.role)).map(role => (
                             <div key={role.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative group">
                                 <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-slate-700">{role.role}</p>
                                        <p className="text-xs text-slate-500">{role.name}</p>
                                    </div>
                                    <button onClick={() => handleDeleteRole(role.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                        <X size={14}/>
                                    </button>
                                 </div>
                             </div>
                         ))}
                         {governanceRoles.filter(r => !['Sponsor', 'Steering Committee', 'Program Manager'].includes(r.role)).length === 0 && (
                             <div className="col-span-3 text-center text-xs text-slate-400 italic">No additional roles defined.</div>
                         )}
                     </div>
                </div>
              </div>
            </div>
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        </div>

        {/* Governance Cadence */}
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-green-500"/> Governance Cadence
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {governanceEvents.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-nexus-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-full shadow-sm text-slate-500">
                                <Clock size={20}/>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{event.name}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{event.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-mono font-bold text-nexus-700">{event.nextDate}</p>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{event.frequency}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Add Role SidePanel */}
        <SidePanel
            isOpen={isRolePanelOpen}
            onClose={() => setIsRolePanelOpen(false)}
            title="Add Governance Role"
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsRolePanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRole}>Add Role</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role Title</label>
                    <Input value={newRole.role} onChange={e => setNewRole({...newRole, role: e.target.value})} placeholder="e.g. Chief Architect" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assignee Name</label>
                    <Input value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Authority Level</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={newRole.authorityLevel}
                        onChange={e => setNewRole({...newRole, authorityLevel: e.target.value})}
                    >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Responsibilities</label>
                    <textarea 
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500"
                        value={newRole.responsibilities}
                        onChange={e => setNewRole({...newRole, responsibilities: e.target.value})}
                        placeholder="Define key duties and decision scope..."
                    />
                </div>
            </div>
        </SidePanel>
    </div>
  );
};

export default ProgramGovernance;
