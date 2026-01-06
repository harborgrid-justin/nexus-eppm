
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../common/PageHeader';
import { 
    Rocket, Layers, PieChart, Briefcase, CheckCircle, 
    Circle, ArrowRight, ShieldCheck, Database,
    Lock, AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../common/ProgressBar';
import { SetupWizard } from './SetupWizard';
import { useNavigate } from 'react-router-dom';
import { SystemHealthCheck } from './SystemHealthCheck';
import { IndustrySeeder } from './IndustrySeeder';
import { TeamOnboarding } from './TeamOnboarding';

export const GettingStarted: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const navigate = useNavigate();
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'setup' | 'config' | 'team'>('setup');

    // Calculate Setup Progress based on actual Data Provider state
    const checks = [
        { 
            label: 'Organization Profile Configured', 
            done: state.governance.organization.name !== 'Acme Corp Construction' && !!state.governance.organization.taxId 
        },
        { 
            label: 'Portfolio Structure (EPS) Defined', 
            done: state.eps.length > 1 // Assumes ROOT always exists, so need > 1
        },
        { 
            label: 'Strategic Programs Launched', 
            done: state.programs.length > 0 
        },
        { 
            label: 'Active Projects Created', 
            done: state.projects.length > 0 
        },
        { 
            label: 'Users Invited', 
            done: state.users.length > 1 // Assumes 1 default admin exists
        }
    ];

    const progress = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

    const securityLabel = state.governance.security.mfa ? 'MFA Enabled' : 'Standard Auth';
    const securityColor = state.governance.security.mfa ? 'text-green-600' : 'text-yellow-600';
    const SecurityIcon = state.governance.security.mfa ? ShieldCheck : Lock;

    const handleResetSystem = () => {
        if (confirm("DANGER: This will wipe all data for the current session. Reloading the page will restore the demo data. Are you sure?")) {
            dispatch({ type: 'RESET_SYSTEM' });
            alert("System data has been reset for the current session.");
        }
    };

    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} h-full flex flex-col`}>
            {isWizardOpen && <SetupWizard onClose={() => setIsWizardOpen(false)} onComplete={() => setIsWizardOpen(false)} />}
            
            <PageHeader 
                title="Getting Started" 
                subtitle="Day Zero Configuration & Onboarding Hub"
                icon={Rocket}
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => navigate('/portfolio')}>Go to Portfolio</Button>
                        <Button onClick={() => setIsWizardOpen(true)} icon={Rocket} className="bg-nexus-600 text-white">Re-launch Wizard</Button>
                    </div>
                }
            />

            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-slate-200 mb-6">
                <button onClick={() => setActiveTab('setup')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'setup' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500'}`}>
                    Setup & Progress
                </button>
                <button onClick={() => setActiveTab('config')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'config' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500'}`}>
                    Environment Config
                </button>
                <button onClick={() => setActiveTab('team')} className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'team' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500'}`}>
                    Team Onboarding
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'setup' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-left-4">
                        {/* Progress Card */}
                        <Card className="p-6 lg:col-span-1 border-l-4 border-l-nexus-500 h-fit">
                            <h3 className="font-bold text-slate-800 mb-2">Launch Readiness</h3>
                            <div className="mb-6">
                                <div className="flex justify-between text-xs mb-1 font-bold">
                                    <span className="text-nexus-600">{progress}% Complete</span>
                                </div>
                                <ProgressBar value={progress} colorClass="bg-nexus-600" />
                            </div>
                            <div className="space-y-3">
                                {checks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        {check.done ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} className="text-slate-300" />}
                                        <span className={check.done ? 'text-slate-700 font-medium' : 'text-slate-500'}>{check.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions Grid */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div onClick={() => navigate('/admin')} className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-nexus-400 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Layers size={24}/>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Define Portfolio</h4>
                                <p className="text-xs text-slate-500 mb-4">Configure Enterprise Project Structure (EPS) nodes.</p>
                                <div className="flex items-center text-xs font-bold text-blue-600">
                                    Configure EPS <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </div>

                            <div onClick={() => navigate('/programs')} className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-nexus-400 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <PieChart size={24}/>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Create Program</h4>
                                <p className="text-xs text-slate-500 mb-4">Group projects into strategic initiatives.</p>
                                <div className="flex items-center text-xs font-bold text-purple-600">
                                    Manage Programs <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </div>

                            <div onClick={() => navigate('/projectList')} className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-nexus-400 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Briefcase size={24}/>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Launch Project</h4>
                                <p className="text-xs text-slate-500 mb-4">Initialize a new project from a template.</p>
                                <div className="flex items-center text-xs font-bold text-green-600">
                                    New Project <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </div>
                        </div>

                        {/* Snapshot */}
                        <div className="lg:col-span-3 mt-4">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Database size={18} className="text-slate-400"/> Current Environment Snapshot
                            </h3>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</div>
                                    <div className="font-bold text-slate-900">{state.governance.organization.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Base Currency</div>
                                    <div className="font-bold text-slate-900">{state.governance.organization.currency}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">EPS Nodes</div>
                                    <div className="font-bold text-slate-900">{state.eps.length}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Security Policy</div>
                                    <div className={`font-bold ${securityColor} flex items-center gap-1`}><SecurityIcon size={14}/> {securityLabel}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-3 mt-8">
                            <Card className="p-6 border-red-500/50 bg-red-50/50">
                                <h3 className="font-bold text-red-800 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Danger Zone
                                </h3>
                                <p className="text-sm text-red-700 mt-2">
                                    These actions are destructive and cannot be undone. Proceed with caution.
                                </p>
                                <div className="mt-4 pt-4 border-t border-red-200/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">Reset Enterprise Data</p>
                                            <p className="text-xs text-slate-500">Remove all projects, programs, and other data to start fresh.</p>
                                        </div>
                                        <Button variant="danger" onClick={handleResetSystem}>Zero Out Data</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4">
                        <div className="lg:col-span-1">
                            <SystemHealthCheck />
                        </div>
                        <div className="lg:col-span-2">
                            <IndustrySeeder />
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="h-[600px] animate-in fade-in slide-in-from-right-4">
                        <TeamOnboarding />
                    </div>
                )}
            </div>
        </div>
    );
};
