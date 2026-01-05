
import React from 'react';
import { UserPlus, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { useResourceRequestLogic } from '../../hooks/domain/useResourceRequestLogic';

export const ResourceRequest: React.FC = () => {
  const theme = useTheme();
  const { 
      formData, projects, roles, skills, successMsg, 
      updateField, handleSubmit 
  } = useResourceRequestLogic();

  const handleFormSubmit = () => {
      const res = handleSubmit();
      if (res?.error) alert(res.error);
  };

  return (
    <div className="space-y-6">
        <div className={`flex items-center gap-4 p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
            <div className={`p-3 ${theme.colors.surface} rounded-lg shadow-sm text-nexus-600`}><UserPlus size={24}/></div>
            <div>
                <h3 className={`font-bold ${theme.colors.text.primary}`}>Resource Request</h3>
                <p className={`${theme.typography.small}`}>Submit demand for upcoming project phases.</p>
            </div>
        </div>
        
        {successMsg && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle size={16}/> {successMsg}
            </div>
        )}
        
        <div>
            <label className={`${theme.typography.label} mb-1 block`}>Project Context</label>
            <select
                className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                value={formData.projectId}
                onChange={e => updateField('projectId', e.target.value)}
            >
                <option value="">Select Project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Role Required</label>
                <select 
                    className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                    value={formData.role}
                    onChange={e => updateField('role', e.target.value)}
                >
                    <option value="">Select Role...</option>
                    {roles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                </select>
            </div>
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Quantity</label>
                <Input 
                    type="number" 
                    value={formData.quantity}
                    onChange={e => updateField('quantity', parseInt(e.target.value))}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> Start Date</label>
                <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => updateField('startDate', e.target.value)}
                />
            </div>
             <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> End Date</label>
                <Input 
                    type="date"
                    value={formData.endDate}
                    onChange={e => updateField('endDate', e.target.value)}
                />
            </div>
        </div>

        <div>
            <label className={`${theme.typography.label} mb-1 block`}>Skills / Certifications</label>
            <div className={`p-3 border ${theme.colors.border} rounded-lg flex flex-wrap gap-2 ${theme.colors.surface}`}>
                {skills.slice(0, 8).map(skill => (
                    <label key={skill.id} className={`flex items-center gap-2 text-sm ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border} cursor-pointer`}>
                        <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500"/> {skill.name}
                    </label>
                ))}
            </div>
        </div>

        <Button className="w-full" onClick={handleFormSubmit}>Submit Request</Button>
    </div>
  );
};
