
import React, { useState } from 'react';
import { useFeatureFlags } from '../../context/FeatureFlagContext';
import { SystemConfig } from '../../types/auth';
import { XCircle, CheckCircle, Lock, Folder } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '../ui/Button';

const Settings = (LucideIcons as any).Settings || Folder;
const ToggleLeft = (LucideIcons as any).ToggleLeft || XCircle;
const ToggleRight = (LucideIcons as any).ToggleRight || CheckCircle;
const Server = (LucideIcons as any).Server || Folder;
const Shield = (LucideIcons as any).Shield || Lock;

const SystemConfigPanel: React.FC = () => {
  const { flags, isFeatureEnabled } = useFeatureFlags(); 
  // Note: For this implementation, we will simulate local state for system config, 
  // in a real app this would be in the SystemContext
  
  const [config, setConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    mfaEnforced: true,
    sessionTimeoutMinutes: 30,
    allowGuestAccess: false,
    supportEmail: 'support@nexus.com'
  });

  const toggleConfig = (key: keyof SystemConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key as any] }));
  };

  return (
    <div className="space-y-8 max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Server size={20} className="text-nexus-600"/> General System Settings
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-500">Prevents non-admin users from logging in.</p>
                    </div>
                    <button onClick={() => toggleConfig('maintenanceMode')} className={`text-2xl ${config.maintenanceMode ? 'text-nexus-600' : 'text-slate-300'}`}>
                        {config.maintenanceMode ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-slate-900">Allow Guest Access</p>
                        <p className="text-xs text-slate-500">Enable read-only public links for portfolios.</p>
                    </div>
                    <button onClick={() => toggleConfig('allowGuestAccess')} className={`text-2xl ${config.allowGuestAccess ? 'text-nexus-600' : 'text-slate-300'}`}>
                        {config.allowGuestAccess ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (Minutes)</label>
                    <input 
                        type="number" 
                        value={config.sessionTimeoutMinutes}
                        onChange={(e) => setConfig({...config, sessionTimeoutMinutes: parseInt(e.target.value)})}
                        className="w-full border border-slate-300 rounded-md p-2 text-sm"
                    />
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-purple-600"/> Security Policy
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                        <p className="font-medium text-slate-900">Enforce MFA</p>
                        <p className="text-xs text-slate-500">Require Multi-Factor Authentication for all roles.</p>
                    </div>
                    <button onClick={() => toggleConfig('mfaEnforced')} className={`text-2xl ${config.mfaEnforced ? 'text-nexus-600' : 'text-slate-300'}`}>
                        {config.mfaEnforced ? <ToggleRight size={32}/> : <ToggleLeft size={32}/>}
                    </button>
                </div>
            </div>
        </div>

        <div className="flex justify-end">
            <Button variant="primary">Save Configuration</Button>
        </div>
    </div>
  );
};

export default SystemConfigPanel;
