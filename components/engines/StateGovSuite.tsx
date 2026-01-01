import React, { useState } from 'react';
import { Landmark, TrendingUp, Shield, Zap, Truck, DollarSign, Activity, Globe, Scale, Users, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';

type Department = 'Governor' | 'DOT' | 'HHS' | 'Education';

const StateGovSuite: React.FC = () => {
  const theme = useTheme();
  // FIX: Renamed state variable to avoid confusion, though original error was for `activeDept` which was incorrect. The logic uses `activeAgency`.
  const [activeAgency, setActiveAgency] = useState<Department>('Governor');

  // --- MOCK DATA ---
  // FIX: Removed large unused mock data arrays

  // --- RENDERERS ---
  // FIX: Replaced federal-specific render functions with placeholders for state agencies.
  const renderGovernor = () => (
    <div className="p-12 text-center text-slate-500">
        <Landmark size={64} className="mx-auto mb-4 text-slate-300"/>
        <h3 className="text-xl font-bold text-slate-700">Governor's Office Dashboard</h3>
        <p className="max-w-md mx-auto mt-2">State-wide initiatives and budget overview.</p>
    </div>
  );

  const renderDOT = () => (
      <div className="p-12 text-center text-slate-500">
          <Truck size={64} className="mx-auto mb-4 text-slate-300"/>
          <h3 className="text-xl font-bold text-slate-700">Department of Transportation</h3>
          <p className="max-w-md mx-auto mt-2">Integrating highway project trackers, and rail safety metrics.</p>
      </div>
  );

  const renderHHS = () => (
      <div className="p-12 text-center text-slate-500">
          <Users size={64} className="mx-auto mb-4 text-slate-300"/>
          <h3 className="text-xl font-bold text-slate-700">Health & Human Services</h3>
          <p className="max-w-md mx-auto mt-2">Public health initiatives and program status.</p>
      </div>
  );

  const renderEducation = () => (
      <div className="p-12 text-center text-slate-500">
          <Landmark size={64} className="mx-auto mb-4 text-slate-300"/>
          <h3 className="text-xl font-bold text-slate-700">Department of Education</h3>
          <p className="max-w-md mx-auto mt-2">State education program funding and performance.</p>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <Landmark className="text-blue-800" /> State Government Platform
                </h1>
                <p className={theme.typography.small}>State Agency Management System</p>
            </div>
            {/* FIX: Replaced federal department buttons with state agency buttons and corrected state management calls */}
            <div className={`flex ${theme.colors.surface} border border-slate-200 rounded-lg p-1`}>
                <button onClick={() => setActiveAgency('Governor')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Governor' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Landmark size={14}/> Governor's Office
                </button>
                <button onClick={() => setActiveAgency('DOT')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'DOT' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Truck size={14}/> DOT
                </button>
                <button onClick={() => setActiveAgency('HHS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'HHS' ? 'bg-green-50 text-green-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Users size={14}/> HHS
                </button>
                <button onClick={() => setActiveAgency('Education')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${activeAgency === 'Education' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Landmark size={14}/> Education
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {/* FIX: Replaced federal department rendering logic with state agency logic */}
            {activeAgency === 'Governor' && renderGovernor()}
            {activeAgency === 'DOT' && renderDOT()}
            {activeAgency === 'HHS' && renderHHS()}
            {activeAgency === 'Education' && renderEducation()}
        </div>
    </div>
  );
};

// FIX: Exported the correct component name
export default StateGovSuite;