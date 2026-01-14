import React, { useState, useMemo } from 'react';
import { useProgramScopeLogic } from '../../hooks/domain/useProgramScopeLogic';
import { Sliders, FileText, CheckCircle, AlertTriangle, ArrowRight, XCircle, Clock, Plus, Edit2, Trash2, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { ProgramChangeRequestForm } from './ProgramChangeRequestForm';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramScopeProps {
  programId: string;
}

const ProgramScope: React.FC<ProgramScopeProps> = ({ programId }) => {
  const theme = useTheme();
  const { 
      programOutcomes, 
      projects, 
      changeRequests,
      isPanelOpen,
      editingRequest,
      handleOpenPanel,
      handleClosePanel,
      handleSaveRequest,
      handleDeleteRequest,
      handleApprove,
      handleReject
  } = useProgramScopeLogic(programId);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Sliders className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Program Scope & Strategic Outcomes</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {programOutcomes.length > 0 ? programOutcomes.map(outcome => (
                    <Card key={outcome.id} className="p-0 overflow-hidden shadow-sm border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{outcome.description}</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Target Maturity: {outcome.targetDate}</p>
                            </div>
                            <Badge variant={outcome.status === 'On Track' ? 'success' : 'warning'}>{outcome.status}</Badge>
                        </div>
                        <div className="p-6 bg-white">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supporting Project Deliverables</h4>
                            <div className="flex flex-wrap gap-3">
                                {outcome.linkedProjectIds.map(pid => {
                                    const proj = projects.find(p => p.id === pid);
                                    return (
                                        <div key={pid} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-bold text-slate-700 shadow-sm hover:border-nexus-300 transition-colors cursor-default">
                                            <FileText size={14} className="text-nexus-500"/>
                                            <span className="truncate max-w-[200px]">{proj?.name || pid}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                )) : (
                    <div className="min-h-[250px] flex">
                        <EmptyGrid 
                            title="Program Topology Isolated" 
                            description="Define strategic outcomes and link component projects to establish the delivery roadmap."
                            icon={Sliders}
                            actionLabel="Define Program Outcome"
                            onAdd={() => {}}
                        />
                    </div>
                )}
            </div>
        </section>

        <section>
            <div className="flex items-center justify-between mb-6 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="text-nexus-600" size={24}/>
                    <h2 className={theme.typography.h2}>Program Change Control Board (PCCB)</h2>
                </div>
                <Button 
                    onClick={() => handleOpenPanel()} 
                    icon={Plus}
                >
                    New Change Request
                </Button>
            </div>

            <div className="overflow-hidden bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                {changeRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className={theme.components.table.header}>PCR ID</th>
                                    <th className={theme.components.table.header + " w-1/3"}>Narrative</th>
                                    <th className={theme.components.table.header}>Impact Vector</th>
                                    <th className={theme.components.table.header}>Status</th>
                                    <th className={theme.components.table.header + " text-right pr-12"}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {changeRequests.map(pcr => (
                                    <tr key={pcr.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-sm font-black text-slate-400 uppercase">{pcr.id}</span>
                                            <div className="text-[10px] text-slate-400 mt-1 font-bold">{pcr.submittedDate}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-800 text-sm uppercase tracking-tight">{pcr.title}</div>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">{pcr.description}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5 text-[10px] font-bold">
                                                <div className="flex justify-between w-32"><span className="text-slate-400">Cost:</span> <span className={pcr.impact.cost > 0 ? 'text-red-600 font-mono' : 'text-green-600 font-mono'}>{formatCurrency(pcr.impact.cost)}</span></div>
                                                <div className="flex justify-between w-32"><span className="text-slate-400">Time:</span> <span className={pcr.impact.schedule > 0 ? 'text-red-600' : 'text-green-600'}>{pcr.impact.schedule > 0 ? '+' : ''}{pcr.impact.schedule}d</span></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant={pcr.status === 'Approved' ? 'success' : pcr.status === 'Rejected' ? 'danger' : 'warning'}>
                                                {pcr.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right pr-12">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleApprove(pcr)} className="p-1.5 bg-green-50 text-green-600 rounded border border-green-200 hover:bg-green-100 transition-colors" title="Approve"><CheckCircle size={14}/></button>
                                                <button onClick={() => handleDeleteRequest(pcr.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded border border-transparent hover:border-red-100 transition-all"><Trash2 size={14}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20">
                        <EmptyGrid 
                            title="Change Queue Neutral"
                            description="No formal change requests have been registered for this program. Governance remains aligned to the strategic baseline."
                            icon={Clock}
                            actionLabel="Record Change Request"
                            onAdd={() => handleOpenPanel()}
                        />
                    </div>
                )}
            </div>
        </section>

        <ProgramChangeRequestForm 
            isOpen={isPanelOpen} 
            onClose={handleClosePanel} 
            onSave={handleSaveRequest} 
            request={editingRequest} 
        />
    </div>
  );
};

export default ProgramScope;