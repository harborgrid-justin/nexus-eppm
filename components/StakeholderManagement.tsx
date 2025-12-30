
import React, { useState, useMemo } from 'react';
import { useProjectState } from '../hooks';
import {
  Users, BarChart2, DollarSign, Plus,
  LayoutDashboard,
  CheckCircle, AlertCircle, FileText, ChevronRight, LockKeyhole
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';

const TrendingUp = (LucideIcons as any).TrendingUp || BarChart2;
const Filter = (LucideIcons as any).Filter || Plus;
const MessageSquare = (LucideIcons as any).MessageSquare || FileText;
const Shield = (LucideIcons as any).Shield || LockKeyhole;
const AlertTriangle = (LucideIcons as any).AlertTriangle || AlertCircle;
const Target = (LucideIcons as any).Target || AlertCircle;
const ArrowRight = (LucideIcons as any).ArrowRight || ChevronRight;
const UserCheck = (LucideIcons as any).UserCheck || Users;
import StatCard from './shared/StatCard';
import { formatCurrency } from '../utils/formatters';
import { Badge } from './ui/Badge';

interface StakeholderManagementProps {
  projectId: string;
}

// Extended types for internal use
interface EnrichedStakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'Internal' | 'External' | 'Regulatory';
  interest: number; // 1-10
  power: number; // 1-10
  support: number; // -5 to +5 (Sentiment)
  engagement: {
    current: 'Unaware' | 'Resistant' | 'Neutral' | 'Supportive' | 'Leading';
    desired: 'Unaware' | 'Resistant' | 'Neutral' | 'Supportive' | 'Leading';
  };
  financialAuthority: {
    limit: number;
    ccbMember: boolean;
    costInfluence: 'High' | 'Medium' | 'Low';
  };
}

const StakeholderManagement: React.FC<StakeholderManagementProps> = ({ projectId }) => {
  const { project, stakeholders: rawStakeholders } = useProjectState(projectId);
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'analysis' | 'engagement' | 'financial'>('dashboard');

  // Enrich mock data since base model might be simple
  const stakeholders: EnrichedStakeholder[] = useMemo(() => {
    return rawStakeholders.map((s, i) => ({
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

  const metrics = useMemo(() => {
    return {
      total: stakeholders.length,
      highPower: stakeholders.filter(s => s.power > 7).length,
      resistors: stakeholders.filter(s => s.engagement.current === 'Resistant').length,
      gapCount: stakeholders.filter(s => s.engagement.current !== s.engagement.desired).length,
      avgSupport: 3.5 // Mock
    };
  }, [stakeholders]);

  // Chart Data
  const scatterData = useMemo(() => {
    return stakeholders.map(s => ({
      x: s.interest,
      y: s.power,
      z: 100, // Bubble size
      name: s.name,
      role: s.role,
      category: s.category
    }));
  }, [stakeholders]);

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Stakeholders" value={metrics.total} icon={Users} />
        <StatCard title="Key Influencers" value={metrics.highPower} subtext="High Power / High Interest" icon={Target} />
        <StatCard title="Engagement Gaps" value={metrics.gapCount} subtext="Requires Action" icon={AlertTriangle} trend={metrics.gapCount > 0 ? 'down' : 'up'} />
        <StatCard title="Avg Sentiment" value="Positive" subtext="Trend: Improving" icon={MessageSquare} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
          <h3 className="font-bold text-slate-800 mb-4">Power / Interest Grid</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Interest" unit="" domain={[0, 10]} label={{ value: 'Interest', position: 'bottom', offset: 0 }} />
              <YAxis type="number" dataKey="y" name="Power" unit="" domain={[0, 10]} label={{ value: 'Power', angle: -90, position: 'insideLeft' }} />
              <ZAxis type="number" dataKey="z" range={[100, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-slate-200 shadow-md rounded text-xs">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-slate-500">{data.role}</p>
                      <p>Power: {data.y}, Interest: {data.x}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <ReferenceLine x={5} stroke="gray" strokeDasharray="3 3" />
              <ReferenceLine y={5} stroke="gray" strokeDasharray="3 3" />
              <Scatter name="Stakeholders" data={scatterData} fill="#0ea5e9">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.y > 5 && entry.x > 5 ? '#ef4444' : entry.y > 5 ? '#eab308' : '#22c55e'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className="font-bold text-slate-800 mb-4">Top Concerns & Issues</h3>
          <div className="space-y-4">
             {[
               { topic: 'Budget Cuts', raisedBy: 'Finance Director', status: 'Open', priority: 'High' },
               { topic: 'Schedule Compression', raisedBy: 'Site Manager', status: 'In Review', priority: 'Medium' },
               { topic: 'Vendor Selection', raisedBy: 'Procurement Lead', status: 'Closed', priority: 'Low' },
             ].map((issue, i) => (
               <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                 <div>
                   <p className="font-bold text-sm text-slate-800">{issue.topic}</p>
                   <p className="text-xs text-slate-500">Raised by: {issue.raisedBy}</p>
                 </div>
                 <div className="text-right">
                   <Badge variant={issue.priority === 'High' ? 'danger' : issue.priority === 'Medium' ? 'warning' : 'success'}>
                     {issue.priority}
                   </Badge>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngagementMatrix = () => (
    <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-full overflow-auto`}>
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BarChart2 className="text-nexus-600" size={20} /> Engagement Assessment Matrix
      </h3>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stakeholder</th>
            {['Unaware', 'Resistant', 'Neutral', 'Supportive', 'Leading'].map(level => (
              <th key={level} className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">{level}</th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action Plan</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {stakeholders.map(s => (
            <tr key={s.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="font-bold text-sm text-slate-900">{s.name}</div>
                <div className="text-xs text-slate-500">{s.role}</div>
              </td>
              {['Unaware', 'Resistant', 'Neutral', 'Supportive', 'Leading'].map(level => {
                const isC = s.engagement.current === level;
                const isD = s.engagement.desired === level;
                return (
                  <td key={level} className="px-6 py-4 text-center relative">
                    {isC && <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-200 text-slate-700 font-bold mr-1" title="Current">C</span>}
                    {isD && <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-nexus-600 text-white font-bold" title="Desired">D</span>}
                    {isC && isD && <span className="absolute top-4 right-4 text-green-500"><CheckCircle size={12}/></span>}
                  </td>
                );
              })}
              <td className="px-6 py-4">
                {s.engagement.current !== s.engagement.desired ? (
                  <button className="text-xs text-nexus-600 font-medium hover:underline flex items-center gap-1">
                    Create Plan <ArrowRight size={12}/>
                  </button>
                ) : (
                  <span className="text-xs text-green-600 font-medium">Aligned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFinancialAuthority = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-full"><DollarSign size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Approval Capacity</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stakeholders.reduce((sum, s) => sum + s.financialAuthority.limit, 0))}</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-full"><Shield size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">CCB Members</p>
              <p className="text-2xl font-bold text-slate-900">{stakeholders.filter(s => s.financialAuthority.ccbMember).length}</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-full"><UserCheck size={24}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Budget Owners</p>
              <p className="text-2xl font-bold text-slate-900">3</p>
            </div>
         </div>
      </div>

      <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Financial Authority Register</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stakeholder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cost Influence</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Approval Limit</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">CCB Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delegation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stakeholders.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.role}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={s.financialAuthority.costInfluence === 'High' ? 'danger' : s.financialAuthority.costInfluence === 'Medium' ? 'warning' : 'neutral'}>
                    {s.financialAuthority.costInfluence}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm font-bold text-slate-700">
                  {formatCurrency(s.financialAuthority.limit)}
                </td>
                <td className="px-6 py-4 text-center">
                  {s.financialAuthority.ccbMember ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full"><CheckCircle size={14}/></span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {s.financialAuthority.limit > 100000 ? 'No Delegation' : 'Project Manager'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
          <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><Target size={14}/> Power/Interest</button>
          <button onClick={() => setActiveTab('engagement')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'engagement' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><TrendingUp size={14}/> Engagement</button>
          <button onClick={() => setActiveTab('financial')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${activeTab === 'financial' ? 'bg-nexus-50 text-nexus-700' : 'text-slate-500'}`}><DollarSign size={14}/> Financial</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analysis' && renderDashboard()} {/* Reusing Dashboard logic for simplicity but focusing on the chart */}
        {activeTab === 'engagement' && renderEngagementMatrix()}
        {activeTab === 'financial' && renderFinancialAuthority()}
      </div>
    </div>
  );
};

export default StakeholderManagement;
