
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { FileText, Check, X, DollarSign, Download, Filter, Plus, MoreHorizontal, ArrowRight, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { EmptyState } from '../common/EmptyState';

const TemplateHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
);

export const InvoiceProcessingTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [selectedId, setSelectedId] = useState<string | null>(state.invoices[0]?.id || null);
    
    // Use live invoices
    const invoices = state.invoices || [];

    if (invoices.length === 0) {
        return (
            <div className={`h-full flex items-center justify-center ${theme.layout.pagePadding}`}>
                <EmptyState title="No Invoices" description="Invoice queue is empty." icon={FileText} />
            </div>
        );
    }

    const selectedInvoice = invoices.find(i => i.id === selectedId) || invoices[0];
    const vendorName = state.vendors.find(v => v.id === selectedInvoice.vendorId)?.name || selectedInvoice.vendorId;

    return (
        <div className={`h-full flex ${theme.layout.pagePadding} gap-6 bg-slate-50`}>
            <div className="w-1/3 min-w-[300px] flex flex-col gap-4">
                <TemplateHeader title="Invoice Queue" subtitle="Accounts Payable Workflow" />
                <Card className="flex-1 overflow-hidden flex flex-col p-0">
                    <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                        <Input isSearch placeholder="Search vendor or ID..." />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {invoices.map(inv => {
                            const vName = state.vendors.find(v => v.id === inv.vendorId)?.name || inv.vendorId;
                            return (
                                <div 
                                    key={inv.id} 
                                    onClick={() => setSelectedId(inv.id)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedId === inv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-slate-800 text-xs font-mono">{inv.invoiceNumber}</span>
                                        <span className="text-xs text-slate-500">{inv.issueDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-600">{vName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-slate-900">{formatCurrency(inv.amount)}</p>
                                            <Badge variant={inv.status === 'Approved' ? 'success' : inv.status === 'Disputed' ? 'danger' : 'warning'}>{inv.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
            
            <div className="flex-1 flex flex-col">
                <Card className="h-full flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">{selectedInvoice.invoiceNumber}</h3>
                            <p className="text-sm text-slate-500">Submitted by {vendorName}</p>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="danger" icon={X}>Reject</Button>
                             <Button variant="primary" icon={Check}>Approve & Pay</Button>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill To</span>
                                <p className="font-bold text-slate-800 mt-1">{state.governance.organization.name}</p>
                                <p className="text-sm text-slate-600">Headquarters</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Due</span>
                                <p className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(selectedInvoice.amount)}</p>
                                <p className="text-sm text-red-500 font-bold mt-1">Due {selectedInvoice.dueDate}</p>
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Line Items</h4>
                        <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            Line item details not synced from ERP.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const CashFlowModelingTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();

    // Dynamically calculate cash flow from all projects
    const cashFlowData = useMemo(() => {
        const buckets: Record<string, { inflow: number; outflow: number }> = {};
        const today = new Date();
        
        // Init 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const key = d.toLocaleString('default', { month: 'short' });
            buckets[key] = { inflow: 0, outflow: 0 };
        }

        state.projects.forEach(p => {
             // Mock inflows based on funding
             const monthlyFunding = (p.budget / 12);
             // Mock outflows based on spend rate
             const monthlySpend = (p.budget / 10); 
             
             Object.keys(buckets).forEach(k => {
                 buckets[k].inflow += monthlyFunding;
                 buckets[k].outflow += monthlySpend;
             });
        });

        return Object.entries(buckets).map(([month, val]) => ({
            month,
            inflow: Math.round(val.inflow),
            outflow: Math.round(val.outflow),
            net: Math.round(val.inflow - val.outflow)
        }));
    }, [state.projects]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6`}>
             <div className="flex justify-between items-center">
                 <TemplateHeader title="Cash Flow Modeling" subtitle="Portfolio Liquidity Forecast" />
                 <Button icon={RefreshCw}>Recalculate Model</Button>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
                     <h3 className="font-bold text-slate-800 mb-6">Net Cash Position (6 Months)</h3>
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={cashFlowData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="month" />
                             <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                             <Tooltip formatter={(val: number) => formatCurrency(val)} />
                             <Legend />
                             <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} name="Funding Inflow" />
                             <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} name="Cost Outflow" />
                             <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Net Position" />
                         </LineChart>
                     </ResponsiveContainer>
                 </div>
                 
                 <div className="space-y-4">
                     <Card className="p-6">
                         <h4 className="font-bold text-slate-700 mb-4">Assumptions</h4>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Payment Terms</label>
                                 <div className="flex gap-2 mt-1">
                                     <button className="px-3 py-1 text-xs border rounded bg-slate-800 text-white">Net 30</button>
                                     <button className="px-3 py-1 text-xs border rounded bg-white text-slate-600">Net 45</button>
                                 </div>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Inflation Rate (%)</label>
                                 <Input type="number" defaultValue={(state.governance.inflationRate * 100).toFixed(1)} />
                             </div>
                         </div>
                     </Card>
                     
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                         <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-1"><DollarSign size={16}/> Portfolio Liquidity</h4>
                         <p className="text-xs text-blue-700 leading-relaxed">Aggregated from {state.projects.length} active projects and {state.fundingSources.length} funding sources.</p>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export const PricingTableTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    
    // Group resources by role to calculate avg rate
    const rateCard = useMemo(() => {
        const roles: Record<string, { count: number, totalRate: number }> = {};
        state.resources.forEach(r => {
            if (!roles[r.role]) roles[r.role] = { count: 0, totalRate: 0 };
            roles[r.role].count++;
            roles[r.role].totalRate += r.hourlyRate;
        });
        return Object.entries(roles).map(([role, data]) => ({
            role,
            avgRate: data.totalRate / data.count,
            count: data.count
        })).sort((a,b) => b.avgRate - a.avgRate);
    }, [state.resources]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Service Rate Card" subtitle="Average billable rates by role" />
            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Count</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Hourly Rate</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Daily Rate</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {rateCard.map((rate, i) => (
                            <tr key={i} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{rate.role}</td>
                                <td className="px-6 py-4 text-sm text-slate-600"><Badge variant="neutral">{rate.count} Staff</Badge></td>
                                <td className="px-6 py-4 text-sm text-right font-mono font-medium text-slate-700">{formatCurrency(rate.avgRate)}/hr</td>
                                <td className="px-6 py-4 text-sm text-right font-mono font-bold text-nexus-700">{formatCurrency(rate.avgRate * 8)}/day</td>
                            </tr>
                        ))}
                        {rateCard.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">No resources defined to calculate rates.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const InvoiceGeneratorTmpl: React.FC = () => {
    // This template is largely static structure for PDF generation, so we keep it static 
    // but inject Organization Name from state.
    const { state } = useData();
    const theme = useTheme();
    const orgName = state.governance.organization.name;
    const currency = state.governance.organization.currency;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-100 flex justify-center`}>
            <div className="bg-white shadow-2xl rounded-sm w-[800px] min-h-[1000px] p-12 flex flex-col text-slate-800 relative">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold">N</div>
                            <span className="text-xl font-bold tracking-tight">{orgName}</span>
                        </div>
                        <p className="text-sm text-slate-500">100 Enterprise Way<br/>New York, NY 10001<br/>{currency}</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-light text-slate-300 uppercase tracking-widest mb-4">Invoice</h1>
                        <p className="font-bold">#DRAFT</p>
                        <p className="text-sm text-slate-500">Issued: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Content Placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400">
                    <p>Line Item Builder</p>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs text-slate-400">
                    Generated by Nexus PPM Financial Engine
                </div>
            </div>
        </div>
    );
};

export const TransactionHistoryTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const transactions = state.budgetLog || [];

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Transaction Ledger" subtitle="Immutable financial record stream" />
            <Card className="overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" placeholder="Filter transactions..." />
                    </div>
                    <Button variant="outline" icon={Download}>Export CSV</Button>
                </div>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Txn ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Source</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                        {transactions.map((txn, i) => (
                            <tr key={txn.id} className="hover:bg-slate-50 font-mono text-sm">
                                <td className="px-6 py-3 text-slate-400">{txn.id}</td>
                                <td className="px-6 py-3 text-slate-600">{txn.date}</td>
                                <td className="px-6 py-3 font-sans font-medium text-slate-800">{txn.description}</td>
                                <td className="px-6 py-3 text-slate-600">{txn.source}</td>
                                <td className="px-6 py-3 text-right text-slate-800 font-bold">{formatCurrency(txn.amount)}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No transactions recorded.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export const BudgetAllocationTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();

    // Aggregate by Project Category (Department proxy)
    const allocationData = useMemo(() => {
        const dist: Record<string, number> = {};
        let total = 0;
        state.projects.forEach(p => {
             const cat = p.category || 'Unassigned';
             dist[cat] = (dist[cat] || 0) + p.budget;
             total += p.budget;
        });

        return Object.entries(dist).map(([name, val]) => ({
            name,
            val: total > 0 ? (val/total)*100 : 0,
            amount: val
        }));
    }, [state.projects]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Budget Allocation" subtitle="Distribution by Project Category" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-6">Allocation Mix</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={allocationData} layout="vertical">
                             <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                             <XAxis type="number" unit="%"/>
                             <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 10}}/>
                             <Tooltip formatter={(val:number) => `${val.toFixed(1)}%`} />
                             <Bar dataKey="val" fill="#6366f1" radius={[0, 4, 4, 0]} />
                         </BarChart>
                    </ResponsiveContainer>
                </Card>
                <div className="space-y-4">
                    {allocationData.map(dept => (
                        <Card key={dept.name} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><CreditCard size={18}/></div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{dept.name}</h4>
                                    <p className="text-xs text-slate-500">Allocation: {dept.val.toFixed(1)}%</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-bold">{formatCompactCurrency(dept.amount)}</p>
                            </div>
                        </Card>
                    ))}
                    {allocationData.length === 0 && <div className="text-center text-slate-400 p-8">No budget data available.</div>}
                </div>
            </div>
        </div>
    );
};

export const ExpenseApprovalTmpl: React.FC = () => {
    const theme = useTheme();
    // No explicit 'Approval Queue' in data model, so we show an empty state or filter Expenses
    // We'll filter Expenses (assuming a future status field, but currently they are direct)
    // For now, empty state.
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader title="Expense Approvals" subtitle="Pending reimbursement requests" />
            <EmptyState title="No Pending Approvals" description="All expenses have been processed." icon={Check} />
        </div>
    );
};
