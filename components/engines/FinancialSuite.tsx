
import React, { useState } from 'react';
import { Landmark, TrendingUp, PieChart, ShieldCheck, Scale, DollarSign, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Treemap } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';

const FinancialSuite: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'allocation' | 'cashflow' | 'audit'>('allocation');

  // --- MOCK DATA ---
  const allocationData = [
    { name: 'Digital', size: 45000000, color: '#3b82f6' },
    { name: 'Infrastructure', size: 35000000, color: '#10b981' },
    { name: 'Compliance', size: 15000000, color: '#f59e0b' },
    { name: 'Maintenance', size: 10000000, color: '#64748b' },
    { name: 'R&D', size: 25000000, color: '#8b5cf6' },
  ];

  const cashFlowData = [
    { month: 'Jan', Operating: 4000, Investing: -2400, Financing: 1000 },
    { month: 'Feb', Operating: 3000, Investing: -1398, Financing: 2210 },
    { month: 'Mar', Operating: 2000, Investing: -9800, Financing: 2290 },
    { month: 'Apr', Operating: 2780, Investing: -3908, Financing: 2000 },
    { month: 'May', Operating: 1890, Investing: -4800, Financing: 2181 },
    { month: 'Jun', Operating: 2390, Investing: -3800, Financing: 2500 },
  ];

  const auditLogs = [
    { id: 'AUD-001', control: 'SOX 404 - Change Mgmt', status: 'Pass', date: '2024-05-15' },
    { id: 'AUD-002', control: 'Basel III - Capital Req', status: 'Pass', date: '2024-05-10' },
    { id: 'AUD-003', control: 'GDPR - Data Privacy', status: 'Finding', date: '2024-04-22' },
  ];

  // --- RENDERERS ---

  const renderAllocation = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total CapEx" value="$130M" subtext="FY24 Budget" icon={DollarSign} />
            <StatCard title="OpEx Run Rate" value="$12.5M" subtext="Monthly Average" icon={Activity} />
            <StatCard title="ROI (Portfolio)" value="14.2%" subtext="Weighted Average" icon={TrendingUp} trend="up" />
            <StatCard title="Compliance Score" value="98/100" subtext="Regulatory Audit" icon={ShieldCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> Capital Allocation Heatmap</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={allocationData}
                        dataKey="size"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent colors={allocationData} />}
                    />
                </ResponsiveContainer>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Top Investment Initiatives</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-4 py-2 text-left">Initiative</th>
                            <th className="px-4 py-2 text-right">Budget</th>
                            <th className="px-4 py-2 text-right">NPV</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3 font-medium">Core Banking Migration</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600">$45.0M</td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">$12.5M</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">AI Fraud Detection</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600">$18.2M</td>
                            <td className="px-4 py-3 text-right font-bold text-green-600">$8.4M</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Branch Modernization</td>
                            <td className="px-4 py-3 text-right font-mono text-slate-600">$12.0M</td>
                            <td className="px-4 py-3 text-right font-bold text-yellow-600">$1.2M</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderCashFlow = () => (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[500px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Scale size={18}/> Cash Flow Forecasting</h3>
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
                  <Legend />
                  <Bar dataKey="Operating" fill="#22c55e" stackId="a" />
                  <Bar dataKey="Financing" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="Investing" fill="#ef4444" stackId="a" />
              </BarChart>
          </ResponsiveContainer>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Landmark className="text-green-700" /> Financial Industry Platform
                </h1>
                <p className={theme.typography.small}>Capital Planning, Regulatory Audit & Hedging</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveTab('allocation')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'allocation' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Capital Allocation</button>
                <button onClick={() => setActiveTab('cashflow')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'cashflow' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Cash Flow</button>
                <button onClick={() => setActiveTab('audit')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'audit' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Regulatory Audit</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'allocation' && renderAllocation()}
            {activeTab === 'cashflow' && renderCashFlow()}
            {activeTab === 'audit' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-blue-900">Audit Trail Enabled</h4>
                            <p className="text-sm text-blue-800">Blockchain-verified ledger is active for all budget changes.</p>
                        </div>
                        <ShieldCheck size={24} className="text-blue-500"/>
                    </div>
                    <table className="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Audit ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Control Framework</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{log.control}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{log.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
};

// Helper for Treemap
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, name } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: colors[index % colors.length].color,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">
          {name}
        </text>
      )}
      {width > 50 && height > 50 && (
        <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" fill="#fff" fontSize={10}>
          {formatCompactCurrency(payload.value)}
        </text>
      )}
    </g>
  );
};

export default FinancialSuite;
