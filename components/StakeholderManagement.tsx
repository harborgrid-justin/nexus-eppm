import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { Users, BarChart2, DollarSign, TrendingUp, LayoutDashboard, Plus, ShieldCheck } from 'lucide-react';
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
  const { activeTab, setActiveTab, stakeholders } = useStakeholderManagementLogic();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'engagement', label: 'Engagement', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: DollarSign },
  ];

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
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
                <Button variant="primary" icon={Plus} size="md" onClick={() => {}}>Identify Stakeholder</Button>
            </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {stakeholders.length === 0 ? (
            <EmptyGrid 
                title="Stakeholder Register Null"
                description="Identify project stakeholders to start tracking influence, interest, and engagement strategies."
                icon={ShieldCheck}
                actionLabel="Register Stakeholder"
                onAdd={() => {}}
            />
        ) : (
            <div className="animate-nexus-in h-full">
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