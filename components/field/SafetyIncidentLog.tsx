import React from 'react';
import { AlertTriangle, Plus, ShieldCheck, Activity, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import StatCard from '../shared/StatCard';

interface SafetyIncidentLogProps {
  projectId: string;
}

const SafetyIncidentLog: React.FC<SafetyIncidentLogProps> = ({ projectId }) => {
  const theme = useTheme();

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}/50`}>
       {/* Stats */}
       <div className={`p-6 grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
           <StatCard title="Days Without Incident" value="142" icon={ShieldCheck} trend="up" />
           <StatCard title="TRIR (YTD)" value="0.5" subtext="Total Recordable Rate" icon={Activity} />
           <StatCard title="Open Observations" value="3" icon={AlertTriangle} />
       </div>

       {/* List */}
       <div className="flex-1 overflow-hidden p-6 pt-0 flex flex-col">
           <div className={theme.layout.panelContainer}>
               <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.surface}`}>
                   <div className="flex items-center gap-4">
                       <h3 className={theme.typography.h3}>Incident Registry</h3>
                       <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-48" />
                       </div>
                   </div>
                   <Button size="sm" icon={Plus} variant="danger">Report Incident</Button>
               </div>
               <div className="flex-1 overflow-auto">
                   <table className="min-w-full divide-y divide-slate-100">
                       <thead className="bg-slate-50">
                           <tr>
                               <th className={theme.components.table.header}>Date</th>
                               <th className={theme.components.table.header}>Type</th>
                               <th className={theme.components.table.header}>Description</th>
                               <th className={theme.components.table.header}>Location</th>
                               <th className={theme.components.table.header}>Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           <tr className={theme.components.table.row}>
                               <td className={theme.components.table.cell}>2024-05-12</td>
                               <td className={theme.components.table.cell}><Badge variant="warning">Near Miss</Badge></td>
                               <td className={`${theme.components.table.cell} ${theme.colors.text.primary}`}>Dropped tool from scaffolding. No injuries.</td>
                               <td className={theme.components.table.cell}>Sector 4</td>
                               <td className={theme.components.table.cell}><Badge variant="success">Closed</Badge></td>
                           </tr>
                           <tr className={theme.components.table.row}>
                               <td className={theme.components.table.cell}>2024-06-01</td>
                               <td className={theme.components.table.cell}><Badge variant="info">First Aid</Badge></td>
                               <td className={`${theme.components.table.cell} ${theme.colors.text.primary}`}>Minor cut on hand while handling material.</td>
                               <td className={theme.components.table.cell}>Laydown Yard</td>
                               <td className={theme.components.table.cell}><Badge variant="neutral">Review</Badge></td>
                           </tr>
                       </tbody>
                   </table>
               </div>
           </div>
       </div>
    </div>
  );
};

export default SafetyIncidentLog;