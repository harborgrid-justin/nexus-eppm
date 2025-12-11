import React from 'react';
import { Extension } from '../types';
import { 
  LayoutDashboard, Map, Database, Box, FileText, Settings, 
  MoreVertical, Filter, Plus, RefreshCw, Layers
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import ErrorBoundary from './ErrorBoundary';

interface ExtensionEngineProps {
  extension: Extension;
}

const ExtensionEngineContent: React.FC<ExtensionEngineProps> = ({ extension }) => {
  // --- Renderers based on viewType ---
  
  const renderToolbar = () => (
    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
          <Settings size={14} /> Config
        </button>
      </div>
      <div className="flex gap-2">
         <button className="p-2 text-slate-500 hover:bg-slate-200 rounded">
            <RefreshCw size={16} />
         </button>
         <button className="flex items-center gap-2 px-3 py-1.5 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm">
           <Plus size={16} /> New Record
         </button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-slate-500 text-sm font-medium mb-1">Key Metric {i}</h4>
            <div className="text-2xl font-bold text-slate-900">{(Math.random() * 1000).toFixed(0)}</div>
            <div className="text-xs text-green-600 flex items-center mt-1">+12.5% from last month</div>
          </div>
        ))}
      </div>
      <div className="h-80 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
        <tbody className="bg-white divide-y divide-slate-100">
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
                <MoreVertical size={16} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMap = () => (
     <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/800x600?access_token=pk.mock')] bg-cover opacity-50"></div>
        <div className="bg-white/90 backdrop-blur p-8 rounded-xl shadow-lg text-center z-10 max-w-md">
           <Map size={48} className="mx-auto text-nexus-500 mb-4" />
           <h3 className="text-xl font-bold text-slate-900">Geospatial Engine</h3>
           <p className="text-slate-500 mt-2">
             Map interface loaded for {extension.name}. Real-time telemetry overlay enabled.
           </p>
        </div>
     </div>
  );

  const render3D = () => (
    <div className="flex-1 bg-slate-900 relative flex items-center justify-center">
       <div className="grid grid-cols-12 gap-1 absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(144)].map((_, i) => <div key={i} className="border border-nexus-500/30"></div>)}
       </div>
       <div className="text-center text-slate-300 z-10">
          <Box size={64} className="mx-auto text-nexus-500 mb-6 animate-pulse" />
          <h3 className="text-2xl font-light">3D Model Context</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
             Loading BIM dataset v{extension.version}...<br/>
             WebGL rendering engine initialized.
          </p>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Layers className="text-nexus-600" /> {extension.name}
           </h1>
           <p className="text-slate-500">{extension.description} <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 ml-2">v{extension.version}</span></p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-mono text-slate-400">ENGINE_ID: {extension.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
         {extension.viewType !== 'viewer3d' && extension.viewType !== 'map' && renderToolbar()}
         
         {extension.viewType === 'dashboard' && renderDashboard()}
         {extension.viewType === 'grid' && renderGrid()}
         {extension.viewType === 'form' && renderGrid()} {/* Fallback for form to grid for now */}
         {extension.viewType === 'map' && renderMap()}
         {extension.viewType === 'viewer3d' && render3D()}
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