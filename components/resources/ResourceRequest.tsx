
import React from 'react';
import { UserPlus, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';

export const ResourceRequest: React.FC = () => {
  const theme = useTheme();

  return (
    <div className="space-y-6">
        <div className={`flex items-center gap-4 p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
            <div className={`p-3 ${theme.colors.surface} rounded-lg shadow-sm text-nexus-600`}><UserPlus size={24}/></div>
            <div>
                <h3 className={`font-bold ${theme.colors.text.primary}`}>Resource Request</h3>
                <p className={`${theme.typography.small}`}>Submit demand for upcoming project phases.</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Role Required</label>
                <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}>
                    <option>Senior Engineer</option>
                    <option>Project Manager</option>
                    <option>QA Specialist</option>
                </select>
            </div>
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Quantity</label>
                <Input type="number" defaultValue={1} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> Start Date</label>
                <Input type="date" />
            </div>
             <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> End Date</label>
                <Input type="date" />
            </div>
        </div>

        <div>
            <label className={`${theme.typography.label} mb-1 block`}>Required Skills</label>
            <div className={`p-3 border ${theme.colors.border} rounded-lg flex flex-wrap gap-2 ${theme.colors.surface}`}>
                {['React', 'Node.js', 'Python', 'CAD', 'P6'].map(skill => (
                    <label key={skill} className={`flex items-center gap-2 text-sm ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border} cursor-pointer`}>
                        <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500"/> {skill}
                    </label>
                ))}
            </div>
        </div>

        <Button className="w-full">Submit Request</Button>
    </div>
  );
};
