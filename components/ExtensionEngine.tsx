
import React, { lazy, Suspense, useMemo } from 'react';
import { Extension } from '../types/index';
import { 
  Filter, Plus, RefreshCw, Layers, Loader2, Settings
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';

// Lazy load specialized suites
const DoDSuite = lazy(() => import('./engines/DoDSuite'));
const GovBudgetSuite = lazy(() => import('./engines/GovBudgetSuite'));
const ConstructionSuite = lazy(() => import('./engines/ConstructionSuite'));
const FinancialSuite = lazy(() => import('./engines/FinancialSuite'));
const FedGovSuite = lazy(() => import('./engines/FedGovSuite'));
const StateGovSuite = lazy(() => import('./engines/StateGovSuite'));
const IoTStream = lazy(() => import('./iot/IoTStream').then(module => ({ default: module.IoTStream })));

// Renderers
const Viewer3DRenderer = lazy(() => import('./engines/renderers/Viewer3DRenderer').then(m => ({ default: m.Viewer3DRenderer })));
const MapRenderer = lazy(() => import('./engines/renderers/MapRenderer').then(m => ({ default: m.MapRenderer })));

interface ExtensionEngineProps {
  extension: Extension;
}

const ExtensionEngineContent: React.FC<ExtensionEngineProps> = ({ extension }) => {
  const theme = useTheme();

  // Deterministic mock data to prevent render jitter (Rule 1)
  const dashboardMetrics = useMemo(() => {
      // Use extension ID as a seed-like factor
      const seed = extension.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return [1, 2, 3].map(i => ({
          id: i,
          value: Math.floor(100 + ((seed * i * 37) % 900)), // Pseudo-random based on static props
          trend: (10 + ((seed * i) % 15)).toFixed(1)
      }));
  }, [extension.id]);

  // --- SPECIALIZED SUITE ROUTING ---
  if (extension.id === 'dod_suite') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <DoDSuite />
          </Suspense>
      );
  }

  if (extension.id === 'gov_budget') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <GovBudgetSuite />
          </Suspense>
      );
  }

  if (extension.id === 'construction_suite') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <ConstructionSuite />
          </Suspense>
      );
  }

  if (extension.id === 'finance_suite') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <FinancialSuite />
          </Suspense>
      );
  }

  if (extension.id === 'fed_gov_platform') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <FedGovSuite />
          </Suspense>
      );
  }

  if (extension.id === 'state_gov_platform') {
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <StateGovSuite />
          </Suspense>
      );
  }
  
  if (extension.id === 'iot_smart_site') { 
      return (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
              <IoTStream />
          </Suspense>
      );
  }

  // --- GENERIC RENDERERS based on viewType ---
  
  if (extension.viewType === 'viewer3d') {
      return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
           <Viewer3DRenderer extensionVersion={extension.version} />
        </Suspense>
      );
  }

  if (extension.viewType === 'map') {
      return (
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-nexus-500"/></div>}>
           <MapRenderer extensionName={extension.name} />
        </Suspense>
      );
  }
  
  const renderToolbar = () => (
    <div className={`p-4 border-b ${theme.colors.border} bg-slate-50 flex justify-between items-center`}>
      <div className="flex gap-2">
        <button className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm`}>
          <Filter size={14} /> Filter
        </button>
        <button className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm`}>
          <Settings size={14} /> Config
        </button>
      </div>
      <div className="flex gap-2">
         <button className="p-2 text-slate-500 hover:bg-slate-200 rounded">
            <RefreshCw size={16} />
         </button>
         <button className={`flex items-center gap-2 px-3 py-1.5 ${theme.colors.primary} text-white rounded-lg text-sm font-medium ${theme.colors.primaryHover} shadow-sm`}>
           <Plus size={16} /> New Record
         </button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardMetrics.map(item => (
          <div key={item.id} className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg p-5`}>
            <h4 className="text-slate-500 text-sm font-medium mb-1">Key Metric {item.id}</h4>
            <div className={`text-2xl font-bold ${theme.colors.text.primary}`}>{item.value}</div>
            <div className="text-xs text-green-600 flex items-center mt-1">+{item.trend}% from last month</div>
          </div>
        ))}
      </div>
      <div className={`h-80 ${theme.colors.surface} border ${theme.colors.border} rounded-lg p-4`}>
        <h4 className="text-slate-800 font-bold mb-4">Trends Analysis</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[
            { name: 'Jan', val: 400 }, { name: 'Feb', val: 300 }, { name: 'Mar', val: 600 },
            { name: 'Apr', val: 800 }, { name: 'May', val: 500 }, { name: 'Jun', val: 900 },
          ]}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} />
             <XAxis dataKey="name" />
             <YAxis />
             <Tooltip />
             <Line type="monotone" dataKey="val" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderGrid = () => (
    <div className="flex-1 overflow-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr>
            {['ID', 'Name', 'Status', 'Date', 'Owner', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">REC-{1000+i}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Item Description {i+1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2024-03-{10+i}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">User {i+1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                {/* Simplified for now */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className={`text-2xl font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
             <Layers className="text-nexus-600" /> {extension.name}
           </h1>
           <p className={`text-xs ${theme.colors.text.secondary}`}>{extension.description} <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 ml-2">v{extension.version}</span></p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-mono text-slate-400">ENGINE_ID: {extension.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className={`${theme.colors.surface} rounded-lg shadow-sm border ${theme.colors.border} overflow-hidden flex flex-col flex-1`}>
         {extension.viewType !== 'viewer3d' && extension.viewType !== 'map' && renderToolbar()}
         
         {extension.viewType === 'dashboard' && renderDashboard()}
         {extension.viewType === 'grid' && renderGrid()}
         {extension.viewType === 'form' && renderGrid()} {/* Fallback for form to grid for now */}
      </div>
    </div>
  );
};

const ExtensionEngine: React.FC<ExtensionEngineProps> = (props) => (
    <ErrorBoundary name={`Extension: ${props.extension.name}`}>
        <ExtensionEngineContent {...props} />
    </ErrorBoundary>
);

export default ExtensionEngine;
