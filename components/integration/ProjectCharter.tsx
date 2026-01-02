import React from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, Target, Shield, Users, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ProjectCharter: React.FC = () => {
  const { project, stakeholders, assignedResources } = useProjectWorkspace();
  const theme = useTheme();

  const sponsor = stakeholders.find(s => s.role === 'Sponsor');
  const pm = assignedResources.find(r => r.id === project.managerId);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        {/* Header */}
        <div className="flex justify-between items-start">
            <div>
                <h2 className={theme.typography.h2}>Project Charter</h2>
                <p className={theme.typography.small}>Authorizing document for {project.name}</p>
            </div>
            <Badge variant="success">Approved</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target size={18} className="text-nexus-600"/> Business Case
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {project.businessCase || "No business case defined."}
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Description</h4>
                        <p className="text-sm text-slate-700">{project.description}</p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-blue-600"/> Constraints & Assumptions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Constraints</h4>
                            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                <li>Budget Cap: {formatCurrency(project.budget)}</li>
                                <li>Finish No Later Than: {formatDate(project.endDate)}</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Assumptions</h4>
                            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                {(project.assumptions || []).map((a, i) => (
                                    <li key={i}>{a.description}</li>
                                ))}
                                {!project.assumptions?.length && <li>Regulatory approval by Q1</li>}
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-600"/> Key Roles
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">S</div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Sponsor</p>
                                <p className="text-sm font-bold text-slate-900">{sponsor?.name || 'Pending'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">PM</div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Project Manager</p>
                                <p className="text-sm font-bold text-slate-900">{pm?.name || project.managerId}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Briefcase size={18} className="text-green-600"/> Authorization
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Charter ID</span>
                            <span className="font-mono">{project.code}-CH-01</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Date Signed</span>
                            <span>{formatDate(project.startDate)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-slate-500">Authorized Cost</span>
                            <span className="font-bold">{formatCurrency(project.budget)}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default ProjectCharter;
