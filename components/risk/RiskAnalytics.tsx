
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Cell } from 'recharts';
import { Risk } from '../../types';
import { formatCompactCurrency } from '../../utils/formatters';

interface RiskAnalyticsProps {
    risks: Risk[];
}

const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ risks }) => {
    // 1. Exposure Trend (Mocked)
    const trendData = [
        { month: 'Jan', Exposure: 120000, Count: 5 },
        { month: 'Feb', Exposure: 150000, Count: 8 },
        { month: 'Mar', Exposure: 180000, Count: 12 },
        { month: 'Apr', Exposure: 160000, Count: 10 },
        { month: 'May', Exposure: 220000, Count: 15 },
        { month: 'Jun', Exposure: 190000, Count: 13 },
    ];

    // 2. Score Distribution
    const scoreDistribution = [
        { name: 'Low (1-5)', count: risks.filter(r => r.score <= 5).length },
        { name: 'Med (6-14)', count: risks.filter(r => r.score > 5 && r.score < 15).length },
        { name: 'High (15-25)', count: risks.filter(r => r.score >= 15).length },
    ];

    return (
        <div className="h-full p-6 overflow-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Risk Portfolio Analytics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                    <h4 className="font-bold text-slate-700 mb-4">Risk Exposure Trend (EMV)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" tickFormatter={(val) => formatCompactCurrency(val)} />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="Exposure" stroke="#0ea5e9" strokeWidth={3} />
                            <Line yAxisId="right" type="monotone" dataKey="Count" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                    <h4 className="font-bold text-slate-700 mb-4">Severity Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" barSize={50} radius={[4,4,0,0]}>
                                {scoreDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 2 ? '#ef4444' : index === 1 ? '#eab308' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalytics;