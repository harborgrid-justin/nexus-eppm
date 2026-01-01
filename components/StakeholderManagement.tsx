


import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { 
  Users, BarChart2, DollarSign, TrendingUp, Filter, Plus, 
  MessageSquare, Shield, AlertTriangle, Target, LayoutDashboard, 
  CheckCircle, ArrowRight, UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';
import StatCard from './shared/StatCard';
import { formatCurrency } from '../utils/formatters';
import { Badge } from './ui/Badge';
import { StakeholderDashboard } from './stakeholder/StakeholderDashboard';
import { EngagementMatrix } from './stakeholder/EngagementMatrix';
import { FinancialAuthority } from './stakeholder/FinancialAuthority';
// FIX: Corrected import path for EnrichedStakeholder type to resolve module resolution error.
import { EnrichedStakeholder } from '../types/index';

const StakeholderManagement: React.FC = () => {
  const { project, stakeholders: rawStakeholders } = useProjectWorkspace();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'analysis' | 'engagement' | 'financial'>('dashboard');

  // Enrich mock data since base model might be simple
  const stakeholders: EnrichedStakeholder[] = useMemo(() => {
    return (rawStakeholders || []).map((s, i) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      organization: i % 2 === 0 ? 'Internal' : 'Client Corp',
      category: i === 0 ? 'Internal' : 'External',
      interest: s.interest === 'High' ? 9 : s.interest === 'Medium' ? 5 : 2,
      power: s.influence === 'High' ? 9 : s.influence === 'Medium' ? 5 : 2,
      support: s.engagementStrategy === 'Manage Closely' ? 2 : 4,
      engagement: {
        current: (project?.stakeholderEngagement?.find(e => e.stakeholderId === s.id)?.currentLevel as any) || 'Neutral',
        desired: (project?.stakeholderEngagement?.find(e => e.stakeholderId === s.id)?.desiredLevel as any) || 'Supportive',
      },
      financialAuthority: {
        limit: s.influence === 'High' ? 500000 : 10000,
        ccbMember: s.influence === 'High',
        costInfluence: s.influence as 'High' | 'Medium' | 'Low'
      }
    }));
  }, [rawStakeholders, project]);

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