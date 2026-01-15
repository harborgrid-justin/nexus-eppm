
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { Users, TrendingUp, DollarSign, LayoutDashboard, Plus, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { StakeholderDashboard } from './stakeholder/StakeholderDashboard';
import { EngagementMatrix } from './stakeholder/EngagementMatrix';
import { FinancialAuthority } from './stakeholder/FinancialAuthority';
import { useStakeholderManagementLogic } from '../hooks/domain/useStakeholderManagementLogic';
import { PageHeader } from './common/PageHeader';
import { Button } from './ui/Button';
import { EmptyGrid } from './common/EmptyGrid';

const StakeholderManagement: React.FC = () => {
  const theme = useTheme();
  const { project } = useProjectWorkspace();
  const { activeTab, setActiveTab, stakeholders } = useStakeholderManagementLogic();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: DollarSign },
  ];

  if (!project) return null;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.colors.background}`}>
      <div className={`${theme.layout.pagePadding} pb-0`}>
        <PageHeader 
            title="Stakeholder Management" 
            subtitle="Analyze influence, manage engagement, and track financial authority."
            icon={Users}
            actions={
                <div className="flex gap-3">
                    <div className={`flex ${theme.colors.background} border ${theme.colors.border} rounded-xl p-1 shadow-sm`}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)} 
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                <tab.icon size={14} className="inline mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            }
        />
      </div>

      <div className={`flex-1 flex flex-col m-6 md:m-8 mt-4 overflow-hidden relative`}>
        {stakeholders.length === 0 ? (
            <div className="flex-1 flex h-full">
                <EmptyGrid 
                    title="Stakeholder Register Null"
                    description="Identify project stakeholders to start tracking influence, interest, and engagement strategies. Salience mapping is required for risk assessment."
                    icon={ShieldCheck}
                    actionLabel="Register Stakeholder"
                    onAdd={() => setActiveTab('dashboard')} 
                />
            </div>
        ) : (
            <div className={`flex-1 overflow-y-auto animate-nexus-in ${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm p-8 scrollbar-thin`}>
                {activeTab === 'dashboard' && <StakeholderDashboard stakeholders={stakeholders} />}
                {activeTab === 'engagement' && <EngagementMatrix stakeholders={stakeholders} />}
                {activeTab === 'financial' && <FinancialAuthority stakeholders={stakeholders} />}
            </div>
        )}
      </div>
    </div>
  );
};

export default StakeholderManagement;
