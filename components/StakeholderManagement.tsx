
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { 
  Users, BarChart2, DollarSign, TrendingUp, LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { StakeholderDashboard } from './stakeholder/StakeholderDashboard';
import { EngagementMatrix } from './stakeholder/EngagementMatrix';
import { FinancialAuthority } from './stakeholder/FinancialAuthority';
import { EnrichedStakeholder } from '../types/index';
import { useStakeholderManagementLogic } from '../hooks/domain/useStakeholderManagementLogic';

const StakeholderManagement: React.FC = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab, stakeholders } = useStakeholderManagementLogic();

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={theme.typography.h1}>
            <Users className="text-nexus-600" /> Stakeholder Management
          </h1>
          <p className={theme.typography.small}>Analyze influence, manage engagement, and track financial authority.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><LayoutDashboard size={14}/> Dashboard</button>
          <button onClick={() => setActiveTab('engagement')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'engagement' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><TrendingUp size={14}/> Engagement</button>
          <button onClick={() => setActiveTab('financial')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'financial' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><DollarSign size={14}/> Financial</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <StakeholderDashboard stakeholders={stakeholders} />}
        {activeTab === 'engagement' && <EngagementMatrix stakeholders={stakeholders} />}
        {activeTab === 'financial' && <FinancialAuthority stakeholders={stakeholders} />}
      </div>
    </div>
  );
};

export default StakeholderManagement;
