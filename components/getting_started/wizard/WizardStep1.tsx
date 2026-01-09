
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Input } from '../../ui/Input';

interface Props {
  orgName: string;
  setOrgName: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
}

export const WizardStep1: React.FC<Props> = ({ orgName, setOrgName, currency, setCurrency }) => {
    const theme = useTheme();
    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Organization Profile</h3>
                <p className="text-slate-500 text-sm">Set the legal entity and financial baseline.</p>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
                <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Acme Corp" className="h-12 text-lg" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Base Currency</label>
                <select 
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm bg-white h-12 focus:ring-2 focus:ring-nexus-500 outline-none"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                </select>
            </div>
        </div>
    );
};
