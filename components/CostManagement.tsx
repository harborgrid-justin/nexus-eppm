import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { DollarSign, TrendingUp, AlertTriangle, FileText, CheckCircle, Plus, PieChart as PieIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

interface CostManagementProps {
  projectId: string;
}

const CostManagement: React.FC<CostManagementProps> = ({ projectId }) => {
  const { getProjectBudget, getProjectChanges } = useData();
  const [view, setView] = useState<'budget' | 'changes'>('budget');
  
  const budgetItems = getProjectBudget(projectId);
  const changeOrders = getProjectChanges(projectId);

  const totalPlanned = budgetItems.reduce((acc, item) => acc + item.planned, 0);
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
  const totalVariance = budgetItems.reduce((acc, item) => acc + item.variance, 0);

  const pendingCOAmount = changeOrders.filter(co => co.status === 'Pending Approval').reduce((acc, co) => acc + co.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="text-green-600" /> Cost Management
            </h1>
            <p className="text-slate-500">Track project budget, actuals, and change orders.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setView('budget')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'budget' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Budget Overview
            </button>
            <button 
               onClick={() => setView('changes')}
               className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'changes' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Change Orders
             </button>
          </div>
       </div>

       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500 mb-1">Total Budget</div>
             <div className="text-2xl font-bold text-slate-900">${(totalPlanned / 1000000).toFixed(2)}M</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500 mb-1">Actual Spend</div>
             <div className="text-2xl font-bold text-blue-600">${(totalActual / 1000000).toFixed(2)}M</div>
             <div className="text-xs text-slate-400 mt-1">{((totalActual/totalPlanned)*100).toFixed(1)}% utilized</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500 mb-1">Variance</div>
             <div className="text-2xl font-bold text-green-600">${(totalVariance / 1000000).toFixed(2)}M</div>
             <div className="text-xs text-slate-400 mt-1">Under Budget</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-sm text-slate-500 mb-1">Pending Changes</div>
             <div className="text-2xl font-bold text-amber-500">${(pendingCOAmount / 1000).toFixed(1)}k</div>
             <div className="text-xs text-slate-400 mt-1">{changeOrders.filter(co => co.status === 'Pending Approval').length} requests</div>
          </div>
       </div>

       <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {view === 'budget' ? (
            <>
               <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900">Budget Breakdown</h3>
               </div>
               <div className="flex-1 overflow-auto p-6">
                  {/* Chart Section */}
                  <div className="h-64 mb-8">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgetItems}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="category" />
                           <YAxis tickFormatter={(val) => `$${val/1000000}M`} />
                           <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                           <Bar dataKey="planned" name="Planned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                           <Bar dataKey="actual" name="Actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>

                  {/* Table Section */}
                  <table className="min-w-full divide-y divide-slate-200">
                     <thead className="bg-slate-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Planned</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actual</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Variance</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">%</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {budgetItems.map(item => (
                           <tr key={item.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.category}</td>
                              <td className="px-6 py-4 text-right text-sm text-slate-500">${item.planned.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right text-sm text-slate-900">${item.actual.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right text-sm text-green-600">${item.variance.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right text-sm text-slate-500">{((item.actual/item.planned)*100).toFixed(1)}%</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </>
          ) : (
            <>
               <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Change Order Log</h3>
                  <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 flex items-center gap-2">
                     <Plus size={16} /> Create CO
                  </button>
               </div>
               <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                     <thead className="bg-slate-50 sticky top-0">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider pl-10">Submitted By</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {changeOrders.map(co => (
                           <tr key={co.id} className="hover:bg-slate-50 cursor-pointer">
                              <td className="px-6 py-4 text-sm font-mono text-slate-500">{co.id}</td>
                              <td className="px-6 py-4">
                                 <div className="text-sm font-medium text-slate-900">{co.title}</div>
                                 <div className="text-xs text-slate-500">{co.description}</div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    co.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    co.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                 }`}>
                                    {co.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">${co.amount.toLocaleString()}</td>
                              <td className="px-6 py-4 pl-10 text-sm text-slate-600">
                                 {co.submittedBy} <br/>
                                 <span className="text-xs text-slate-400">{co.dateSubmitted}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </>
          )}
       </div>
    </div>
  );
};

export default CostManagement;
