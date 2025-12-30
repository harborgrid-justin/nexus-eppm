import React, { useState } from 'react';
import { Map as MapIcon, Users, TrendingUp, HeartPulse, GraduationCap, Car, FileText, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';

// Local helper component moved outside
const DollarSignIcon = ({ className }: { className?: string }) => <span className={`font-mono font-bold ${className}`}>$</span>;

const StateGovSuite: React.FC = () => {
  const theme = useTheme();
  const [activeAgency, setActiveAgency] = useState('Governor');

  const budgetData = [
    { agency: 'HHS', allocated: 0, spent: 0 },
    { agency: 'Education', allocated: 0, spent: 0 },
    { agency: 'Transportation', allocated: 0, spent: 0 },
    { agency: 'Public Safety', allocated: 0, spent: 0 },
    { agency: 'Environment', allocated: 0, spent: 0 },
  ];

  const caseLoadData = [
    { name: 'Processed', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Escalated', value: 0 },
  ];
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const renderGovernorDashboard = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Budget Surplus" value="$420M" subtext="FY24 Projection" icon={TrendingUp} trend="up" />
              <StatCard title="Unemployment Rate" value="3.8%" subtext="State Average" icon={Users} trend="down" />
              <StatCard title="Active Capital Projects" value="142" subtext="Infrastructure Bill" icon={MapIcon} />
              <StatCard title="Citizen Satisfaction" value="72%" subtext="Annual Survey" icon={CheckCircle} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                  <h3 className="font-bold text-slate-800 mb-4">Agency Budget Performance (Millions)</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="agency" width={100} tick={{fontSize: 11}}/>
                          <Tooltip formatter={(val: number) => `$${val}M`} />
                          <Legend />
                          <Bar dataKey="allocated" fill="#94a3b8" name="Allocated" />
                          <Bar dataKey="spent" fill="#3b82f6" name="Spent YTD" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Legislative Priorities</h3>
                  <ul className="space-y-3">
                      <li className="p-3 bg-green-50 border border-green-100 rounded-lg flex justify-between items-center">
                          <span className="font-medium text-green-900">Rural Broadband Expansion</span>
                          <span className="text-xs bg-white px-2 py-1 rounded border border-green-200">Enacted</span>
                      </li>
                      <li className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex justify-between items-center">
                          <span className="font-medium text-yellow-900">Clean Energy Tax Credit</span>
                          <span className="text-xs bg-white px-2 py-1 rounded border border-yellow-200">In Committee</span>
                      </li>
                      <li className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                          <span className="font-medium text-blue-900">Teacher Pay Increase</span>
                          <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">Proposed</span>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const renderHHS = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Benefits Distributed" value="$42M" subtext="This Month" icon={DollarSignIcon} />
              <StatCard title="Active Cases" value="16,350" subtext="Family Support" icon={Users} />
              <StatCard title="Avg Processing Time" value="4.2 Days" subtext="Target: 5 Days" icon={FileText} trend="up"/>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px] flex items-center justify-around">
              <div className="w-1/2 h-full">
                  <h3 className="font-bold text-slate-800 mb-4">Case Status Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={caseLoadData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                              {caseLoadData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-8 border-l border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-2">Service Alerts</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> SNAP System Online</p>
                      <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Medicaid Portal Maintenance (Sat 2am)</p>
                      <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Child Care Waitlist Normal</p>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <MapIcon className="text-nexus-600" /> State Government Platform
                </h1>
                <p className={theme.typography.small}>Inter-Agency Coordination & Citizen Services</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveAgency('Governor')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Governor' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'}`}>Governor's Dashboard</button>
                <button onClick={() => setActiveAgency('DOT')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'DOT' ? 'bg-orange-100 text-orange-800' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Car size={14}/> DOT
                </button>
                <button onClick={() => setActiveAgency('HHS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'HHS' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-700'}`}>
                    <HeartPulse size={14}/> HHS
                </button>
                <button onClick={() => setActiveAgency('Education')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Education' ? 'bg-yellow-100 text-yellow-800' : 'text-slate-500 hover:text-slate-700'}`}>
                    <GraduationCap size={14}/> Edu
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeAgency === 'Governor' && renderGovernorDashboard()}
            {activeAgency === 'HHS' && renderHHS()}
            {activeAgency === 'DOT' && (
                <div className="p-12 text-center text-slate-500">
                    <Car size={64} className="mx-auto mb-4 text-slate-300"/>
                    <h3 className="text-xl font-bold text-slate-700">Department of Transportation</h3>
                    <p>Road project map and traffic operations center feed initializing...</p>
                </div>
            )}
            {activeAgency === 'Education' && (
                <div className="p-12 text-center text-slate-500">
                    <GraduationCap size={64} className="mx-auto mb-4 text-slate-300"/>
                    <h3 className="text-xl font-bold text-slate-700">Department of Education</h3>
                    <p>District funding allocation and performance metrics loading...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default StateGovSuite;