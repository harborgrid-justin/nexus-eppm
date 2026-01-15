
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Target, Shield, Users, Briefcase, Info, UserPlus, Activity, Landmark, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { NarrativeField } from '../common/NarrativeField';

const ProjectCharter: React.FC = () => {
  const { project, stakeholders, financials } = useProjectWorkspace();
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();

  const sponsor = useMemo(() => 
    stakeholders.find(s => s.role === 'Sponsor' || s.interest === 'High'),
  [stakeholders]);

  const pm = useMemo(() => 
    state.resources.find(r => r.id === project.managerId),
  [state.resources, project.managerId]);

  const handleUpdate = (field: string, value: any) => {
      dispatch({
          type: 'PROJECT_UPDATE',
          payload: { projectId: project.id, updatedData: { [field]: value } }
      });
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-500`}>
        <div className={`flex justify-between items-start border-b ${theme.colors.border} pb-6`}>
            <div>
                <h2 className={theme.typography.h1}>Project Charter</h2>
                <p className={theme.typography.body}>Authorizing document for corporate investment.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Badge variant={project.status === 'Active' ? 'success' : 'neutral'}>
                    {project.status || 'Draft'}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-tighter">Instance: {project.id}</span>
            </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Left Column: Strategic Mandate */}
            <div className={`lg:col-span-2 space-y-8`}>
                <Card className="p-8 border-l-4 border-l-nexus-500 shadow-sm">
                    <h3 className={`${theme.typography.label} mb-8 flex items-center gap-2 border-b border-slate-50 pb-4`}>
                        <Target size={14} className="text-nexus-600"/> Authorization Strategy
                    </h3>
                    <div className="space-y-10">
                        <NarrativeField 
                            label="Strategic Business Case"
                            value={project.businessCase}
                            placeholderLabel="Define the overarching strategic mandate and justification for this project."
                            onSave={(val) => handleUpdate('businessCase', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <NarrativeField 
                            label="Acceptance Criteria & Quality Mandates"
                            value={project.description}
                            placeholderLabel="Define the mission statement and objective quality standards."
                            onSave={(val) => handleUpdate('description', val)}
                            isReadOnly={!canEditProject()}
                        />
                    </div>
                </Card>

                <Card className="p-8 shadow-sm">
                    <h3 className={`${theme.typography.label} mb-8 flex items-center gap-2 border-b border-slate-50 pb-4`}>
                        <Shield size={14} className="text-blue-600"/> Boundary Conditions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest`}>Authorized Budgetary Ceilings</h4>
                            <div className="space-y-4">
                                <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} group hover:border-nexus-200 transition-colors`}>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Approved Funding</span>
                                    <span className={`text-2xl font-black text-slate-900 font-mono`}>{formatCurrency(project.budget || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 text-sm">
                                    <span className="text-slate-500 font-medium">Contingency Reserve:</span> 
                                    <span className="font-black text-blue-600 font-mono">{formatCurrency(project.reserves?.contingencyReserve || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 text-sm">
                                    <span className="text-slate-500 font-medium">Management Reserve:</span> 
                                    <span className="font-black text-purple-600 font-mono">{formatCurrency(project.reserves?.managementReserve || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 text-sm">
                                    <span className="text-slate-500 font-medium">Lifecycle Dates:</span> 
                                    <span className={`font-bold text-slate-700`}>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <NarrativeField 
                                label="Risk Tolerance & Thresholds"
                                value={project.qualityPlan?.thresholds}
                                placeholderLabel="Establish variance thresholds (SPI/CPI) for governance escalation."
                                onSave={(val) => handleUpdate('qualityPlan', { ...project.qualityPlan, thresholds: val })}
                                isReadOnly={!canEditProject()}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column: Authorities & Metadata */}
            <div className="space-y-6">
                <Card className="p-6 shadow-sm">
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b border-slate-50 pb-3`}>
                        <Users size={14} className="text-purple-600"/> Decision Authorities
                    </h3>
                    <div className="space-y-8">
                        {/* Sponsor Block */}
                        <div className="flex items-center gap-4 group">
                            {sponsor ? (
                                <div className={`w-12 h-12 rounded-2xl bg-nexus-100 flex items-center justify-center font-black text-lg text-nexus-700 border border-nexus-200 shadow-sm`}>
                                    {sponsor.name.charAt(0)}
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-2xl nexus-empty-pattern border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">?</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Sponsor</p>
                                <p className={`text-sm font-bold truncate ${sponsor ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                                    {sponsor?.name || 'Unassigned'}
                                </p>
                                {sponsor ? (
                                    <p className="text-[9px] text-green-600 font-black uppercase mt-0.5">Approved Sign-off</p>
                                ) : (
                                    <button className="text-[9px] text-nexus-600 font-black uppercase mt-1 flex items-center gap-1 hover:underline">
                                        <UserPlus size={10}/> Assign Sponsor
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* PM Block */}
                        <div className="flex items-center gap-4 group">
                            <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-lg text-white shadow-xl`}>
                                {pm ? pm.name.charAt(0) : 'J'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Manager</p>
                                <p className={`text-sm font-bold truncate text-slate-900`}>
                                    {pm?.name || 'Unassigned'}
                                </p>
                                <p className="text-[9px] text-blue-600 font-bold mt-0.5">Authority Level: III</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className={`font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 text-nexus-400`}>
                            <Info size={16} /> Ledger Token
                        </h3>
                        <div className="space-y-4 text-xs">
                            <div className="flex justify-between border-b border-white/10 pb-3">
                                <span className="text-slate-500 font-bold uppercase tracking-tight">Project ID</span>
                                <span className="font-mono font-black text-white">{project.code || 'PENDING'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-3">
                                <span className="text-slate-500 font-bold uppercase tracking-tight">OBS Node</span>
                                <span className="font-bold text-nexus-300 uppercase">{project.obsId || 'UNMAPPED'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-slate-500 font-bold uppercase tracking-tight">Original Basis</span>
                                <span className="text-xl font-mono font-black text-green-400">{formatCurrency(project.originalBudget || 0)}</span>
                            </div>
                        </div>
                    </div>
                    <Briefcase size={180} className="absolute -right-12 -bottom-12 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <Card className="p-6 bg-amber-50/30 border-amber-200">
                    <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck size={14}/> Governance Decisions
                    </h4>
                    <div className="space-y-3">
                        {state.governanceDecisions.filter(d => d.notes.includes(project.id) || d.title.includes(project.name)).map(d => (
                            <div key={d.id} className="text-xs p-2 bg-white border border-amber-100 rounded shadow-sm">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-slate-700">{d.date}</span>
                                    <span className="text-nexus-600 font-black">{d.decision}</span>
                                </div>
                                <p className="text-slate-500 italic">"{d.notes}"</p>
                            </div>
                        ))}
                        {state.governanceDecisions.filter(d => d.notes.includes(project.id) || d.title.includes(project.name)).length === 0 && (
                            <p className="text-[10px] text-slate-400 italic text-center py-2">No formal decisions logged in current cycle.</p>
                        )}
                        {canEditProject() && (
                            <button className="w-full py-2 mt-2 border border-dashed border-amber-300 rounded text-[10px] font-black text-amber-700 uppercase tracking-widest hover:bg-amber-50">
                                Log Board Action
                            </button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default ProjectCharter;
