
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { Users, TrendingUp, DollarSign, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { StakeholderDashboard } from './stakeholder/StakeholderDashboard';
import { EngagementMatrix } from './stakeholder/EngagementMatrix';
import { FinancialAuthority } from './stakeholder/FinancialAuthority';
import { useStakeholderManagementLogic } from '../hooks/domain/useStakeholderManagementLogic';
import { EmptyGrid } from './common/EmptyGrid';
import { PageLayout } from './layout/standard/PageLayout';
import { PanelContainer } from './layout/standard/PanelContainer';
import { ModuleNavigation } from './common/ModuleNavigation';

const StakeholderManagement: React.FC = () => {
  const theme = useTheme();
  const { project } = useProjectWorkspace();
  const { activeTab, setActiveTab, stakeholders } = useStakeholderManagementLogic();

  const navGroups = React.useMemo(() => [
      { id: 'views', label: 'Management Views', items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'engagement', label: 'Engagement', icon: TrendingUp },
          { id: 'financial', label: 'Financial', icon: DollarSign },
      ]}
  ], []);

  if (!project) return null;

  return (
    <PageLayout
        title="Stakeholder Management"
        subtitle="Analyze influence, manage engagement, and track financial authority."
        icon={Users}
    >
        <PanelContainer
            header={
                <ModuleNavigation 
                    groups={navGroups}
                    activeGroup="views"
                    activeItem={activeTab}
                    onGroupChange={() => {}}
                    onItemChange={(id) => setActiveTab(id as any)}
                    className="bg-transparent border-0 shadow-none"
                />
            }
        >
            <div className={`flex-1 overflow-hidden relative`}>
                {stakeholders.length === 0 ? (
                    <div className="flex-1 flex h-full justify-center items-center">
                        <EmptyGrid 
                            title="Stakeholder Register Null"
                            description="Identify project stakeholders to start tracking influence, interest, and engagement strategies. Salience mapping is required for risk assessment."
                            icon={ShieldCheck}
                            actionLabel="Register Stakeholder"
                            onAdd={() => setActiveTab('dashboard')} 
                        />
                    </div>
                ) : (
                    <div className={`flex-1 overflow-y-auto animate-nexus-in p-8 scrollbar-thin h-full`}>
                        {activeTab === 'dashboard' && <StakeholderDashboard stakeholders={stakeholders} />}
                        {activeTab === 'engagement' && <EngagementMatrix stakeholders={stakeholders} />}
                        {activeTab === 'financial' && <FinancialAuthority stakeholders={stakeholders} />}
                    </div>
                )}
            </div>
        </PanelContainer>
    </PageLayout>
  );
};

export default StakeholderManagement;
