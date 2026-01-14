
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
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        {/* Scope Definition */}
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Sliders className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Program Scope & Outcomes</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {programOutcomes.length > 0 ? programOutcomes.map(outcome => (
                    <Card key={outcome.id} className="p-0 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{outcome.description}</h3>
                                <p className="text-xs text-slate-500">Target Date: {outcome.targetDate}</p>
                            </div>
                            <Badge variant={outcome.status === 'On Track' ? 'success' : 'warning'}>{outcome.status}</Badge>
                        </div>
                        <div className="p-4 bg-white">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Realized By Project Deliverables</h4>
                            <div className="flex flex-wrap gap-3">
                                {outcome.linkedProjectIds.map(pid => {
                                    const proj = projects.find(p => p.id === pid);
                                    return (
                                        <div key={pid} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
                                            <FileText size={14} className="text-nexus-500"/>
                                            <span className="font-medium">{proj?.name || pid}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                )) : (
                    <div className="h-[250px] flex">
                        <EmptyGrid 
                            title="Program Logic Undefined" 
                            description="No high-level outcomes or strategic benefits have been identified for this program lifecycle."
                            icon={Sliders}
                        />
                    </div>
                )}
            </div>
        </section>

        {/* Change Control Board */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="text-nexus-600" size={24}/>
                    <h2 className={theme.typography.h2}>Program Change Control Board (PCCB)</h2>
                </div>
                <Button 
                    onClick={() => handleOpenPanel()} 
                    className="bg-nexus-600 hover:bg-nexus-700 text-white" 
                    icon={Plus}
                >
                    New Change Request
                </Button>
            </div>

            <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
                {changeRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">PCR ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/3">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Impact Analysis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {changeRequests.map(pcr => (
                                    <tr key={pcr.id} className="hover:bg-slate-50 group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-slate-700">{pcr.id}</span>
                                            <div className="text-xs text-slate-500 mt-1">{pcr.submittedDate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{pcr.title}</div>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{pcr.description}</p>
                                            <div className="text-xs text-slate-400 mt-2">By: {pcr.submitterId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between w-40"><span className="text-slate-500">Cost:</span> <span className={pcr.impact.cost > 0 ? 'text-red-600 font-mono' : 'text-green-600 font-mono'}>{formatCurrency(pcr.impact.cost)}</span></div>
                                                <div className="flex justify-between w-40"><span className="text-slate-500">Schedule:</span> <span className={pcr.impact.schedule > 0 ? 'text-red-600 font-mono' : 'text-green-600 font-mono'}>{pcr.impact.schedule > 0 ? '+' : ''}{pcr.impact.schedule} days</span></div>
                                                <div className="flex justify-between w-40"><span className="text-slate-500">Risk:</span> <span className={`font-bold ${pcr.impact.risk === 'High' ? 'text-red-600' : 'text-slate-700'}`}>{pcr.impact.risk}</span></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                pcr.status === 'Approved' ? 'success' : 
                                                pcr.status === 'Rejected' ? 'danger' : 'warning'
                                            }>
                                                {pcr.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {pcr.status === 'Pending PCCB' ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleApprove(pcr)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Approve"><CheckCircle size={16}/></button>
                                                    <button onClick={() => handleReject(pcr)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Reject"><XCircle size={16}/></button>
                                                    <button onClick={() => handleOpenPanel(pcr)} className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors" title="Edit"><Edit2 size={16}/></button>
                                                </div>
                                            ) : (
                                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <button onClick={() => handleDeleteRequest(pcr.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><Trash2 size={16}/></button>
                                                 </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12">
                        <EmptyGrid 
                            title="Change Control Queue Clear"
                            description="No formal change requests (PCRs) have been registered for this program scope. All execution remains aligned to the strategic baseline."
                            icon={Clock}
                            actionLabel="Submit Change Request"
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
