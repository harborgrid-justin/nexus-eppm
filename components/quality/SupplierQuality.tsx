
import React, { useMemo } from 'react';
import { Truck, Search, TrendingUp, AlertTriangle, PackageCheck, Award, Box } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import StatCard from '../shared/StatCard';
import { Badge } from '../ui/Badge';

const SupplierQuality: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const vendors = state.vendors;
    const allNCRs = state.nonConformanceReports;

    // --- Mock Data Calculation ---
    const topVendorScores = useMemo(() => {
        return vendors
            .map(v => ({ name: v.name, score: v.performanceScore }))
            .sort((a,b) => b.score - a.score)
            .slice(0, 5);
    }, [vendors]);

    const performanceTrend = [
        { month: 'Jan', AverageScore: 82, Defects: 12 },
        { month: 'Feb', AverageScore: 84, Defects: 10 },
        { month: 'Mar', AverageScore: 83, Defects: 14 },
        { month: 'Apr', AverageScore: 86, Defects: 8 },
        { month: 'May', AverageScore: 88, Defects: 5 },
        { month: 'Jun', AverageScore: 89, Defects: 4 },
    ];

    const materialInspections = [
        { id: 'MRR-1024', item: 'Steel Beams (W12x40)', vendor: 'Acme Steel', qty: 50, rejected: 0, status: 'Accepted', date: '2024-06-15' },
        { id: 'MRR-1025', item: 'Pre-cast Panels', vendor: 'Global Foundations', qty: 12, rejected: 1, status: 'Conditional', date: '2024-06-12' },
        { id: 'MRR-1026', item: 'HVAC Units', vendor: 'BuildRight Inc.', qty: 4, rejected: 0, status: 'Accepted', date: '2024-06-10' },
    ];

    const avgScore = vendors.reduce((sum, v) => sum + v.performanceScore, 0) / (vendors.length || 1);
    const criticalVendors = vendors.filter(v => v.riskLevel === 'High').length;

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {/* Header / KPI */}
            <div className="p-6 border-b border-slate-200 bg-white space-y-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={theme.typography.h2}>
                            <Truck className="text-nexus-600" size={24} /> Supplier Quality Management
                        </h1>
                        <p className={theme.typography.small}>Monitor vendor performance, material receipts, and supply chain risks.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search suppliers..." className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Avg. Vendor Score" value={avgScore.toFixed(1)} icon={Award} trend="up" />
                    <StatCard title="Material Rejection Rate" value="1.8%" icon={PackageCheck} trend="down" />
                    <StatCard title="High Risk Vendors" value={criticalVendors} icon={AlertTriangle} trend={criticalVendors > 0 ? 'down' : undefined} />
                    <StatCard title="Pending Inspections" value="3" icon={Box} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Chart */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-green-600"/> Quality Performance Trend
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" domain={[60, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" label={{ value: 'Defects', angle: 90, position: 'insideRight' }} />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="AverageScore" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="Defects" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Vendors */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Award size={18} className="text-yellow-500"/> Top Performing Vendors
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topVendorScores} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748b', fontSize: 12 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Detailed Vendor List */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Vendor Risk & Performance Registry</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Risk Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Open NCRs</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {vendors.map(vendor => {
                                        const ncrCount = allNCRs.filter(ncr => ncr.vendorId === vendor.id && ncr.status !== 'Closed').length;
                                        return (
                                            <tr key={vendor.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{vendor.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{vendor.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant={vendor.riskLevel === 'Low' ? 'success' : vendor.riskLevel === 'Medium' ? 'warning' : 'danger'}>
                                                        {vendor.riskLevel}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-bold ${vendor.performanceScore > 80 ? 'text-green-600' : vendor.performanceScore > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {vendor.performanceScore}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-700">
                                                    {ncrCount > 0 ? <span className="text-red-600">{ncrCount}</span> : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Material Receipts */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Material Receipt Log</h3>
                            <span className="text-xs text-nexus-600 font-medium cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {materialInspections.map(item => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-mono text-slate-500">{item.id}</span>
                                        <Badge variant={item.status === 'Accepted' ? 'success' : 'warning'}>{item.status}</Badge>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">{item.item}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{item.vendor}</p>
                                    <div className="flex justify-between items-center mt-3 text-xs">
                                        <span className="text-slate-600">Qty: {item.qty}</span>
                                        <span className="text-slate-400">{item.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierQuality;
