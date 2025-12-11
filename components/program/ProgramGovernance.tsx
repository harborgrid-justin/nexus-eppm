
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, Gavel, Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';

interface ProgramGovernanceProps {
  programId: string;
}

const ProgramGovernance: React.FC<ProgramGovernanceProps> = ({ programId }) => {
  const { governanceRoles, governanceEvents } = useProgramData(programId);
  const theme = useTheme();

  // Helper to get role by ID
  const sponsor = governanceRoles.find(r => r.role === 'Sponsor');
  const steering = governanceRoles.find(r => r.role === 'Steering Committee');
  const programMgr = governanceRoles.find(r => r.role === 'Program Manager');

  const RoleCard = ({ role, colorClass }: { role: any, colorClass: string }) => {
      if (!role) return null;
      return (
        <div className={`p-4 rounded-xl border shadow-sm text-center w-64 ${colorClass}`}>
            <div className="font-bold text-sm uppercase tracking-wide mb-1 opacity-80">{role.role}</div>
            <div className="font-bold text-lg mb-1">{role.name}</div>
            <div className="text-xs opacity-70 px-2">{role.responsibilities}</div>
        </div>
      );
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Gavel className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Governance & Oversight</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6">Established decision-making authority, escalation paths, and approval gates.</p>

        {/* Visual Org Chart */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-8 absolute left-6 top-6 flex items-center gap-2">
                <Users size={18} className="text-blue-500"/> Governance Structure
            </h3>
            
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
            
            {/* Project Managers Layer (Visual Placeholder) */}
            <div className="mt-8 flex flex-col items-center w-full max-w-3xl">
                 <div className="h-8 w-0.5 bg-slate-300"></div>
                 <div className="w-1/2 h-0.5 bg-slate-300 relative">
                    <div className="absolute left-0 top-0 h-4 w-0.5 bg-slate-300"></div>
                    <div className="absolute right-0 top-0 h-4 w-0.5 bg-slate-300"></div>
                 </div>
                 <div className="flex justify-between w-2/3 mt-4">
                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-medium">Project Manager A</div>
                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 font-medium">Project Manager B</div>
                 </div>
            </div>
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        </div>

        {/* Governance Cadence */}
        <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-green-500"/> Governance Cadence
            </h3>
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
            
            <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Decision Thresholds</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded bg-green-50 border border-green-100 text-green-800">
                        <strong>Project Manager:</strong> <br/> Changes &lt; $50k / 1 week
                    </div>
                    <div className="p-3 rounded bg-blue-50 border border-blue-100 text-blue-800">
                        <strong>Program Manager:</strong> <br/> Changes &lt; $250k / 1 month
                    </div>
                    <div className="p-3 rounded bg-red-50 border border-red-100 text-red-800">
                        <strong>Steering Committee:</strong> <br/> Changes &gt; $250k / Critical Path
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ProgramGovernance;
