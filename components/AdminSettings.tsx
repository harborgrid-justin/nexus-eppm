import React, { useState } from 'react';
import { Settings, Users, Server, Database, Shield, Bell, CreditCard } from 'lucide-react';

interface AdminSettingsProps {}

const AdminSettings: React.FC<AdminSettingsProps> = () => {
  const [activeSection, setActiveSection] = useState('general');

  const navItems = [
    { id: 'general', icon: Settings, label: 'General' },
    { id: 'users', icon: Users, label: 'Users & Roles' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'integrations', icon: Server, label: 'Integrations' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'general':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Organization Profile</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                  <input type="text" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nexus-500 focus:border-nexus-500 sm:text-sm" defaultValue="Acme Corp Construction" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Fiscal Year Start</label>
                  <select className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nexus-500 focus:border-nexus-500 sm:text-sm">
                    <option>January</option>
                    <option>April</option>
                    <option>October</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Localization</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Default Currency</label>
                    <input type="text" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 bg-slate-50 sm:text-sm" disabled defaultValue="USD ($)" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Date Format</label>
                    <select className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nexus-500 focus:border-nexus-500 sm:text-sm">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <div className="p-4 bg-slate-50 rounded-full mb-4">
               {navItems.find(n => n.id === activeSection)?.icon({ size: 32 })}
             </div>
             <h3 className="text-lg font-medium text-slate-900">Configuration Section</h3>
             <p>This settings module is currently being provisioned.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      {/* Settings Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Settings</h2>
          <p className="text-xs text-slate-500 mt-1">Manage workspace preferences</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === item.id 
                  ? 'bg-white text-nexus-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
         <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h1 className="text-xl font-bold text-slate-900">{navItems.find(n => n.id === activeSection)?.label}</h1>
            <button className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm">
              Save Changes
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-8">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
