
import React, { useState } from 'react';
import { UserPlus, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { ResourceRequest as ResourceRequestType } from '../../types/resource';

export const ResourceRequest: React.FC = () => {
  const theme = useTheme();
  const { state, dispatch } = useData();

  const [formData, setFormData] = useState<Partial<ResourceRequestType>>({
      role: '',
      quantity: 1,
      startDate: '',
      endDate: '',
      notes: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = () => {
      if (!formData.role || !formData.quantity || !formData.startDate) {
          alert("Please fill in required fields.");
          return;
      }
      
      const request: ResourceRequestType = {
          id: generateId('REQ'),
          projectId: 'P1001', // Mock project context, ideally passed via props
          projectName: 'Downtown Metro Hub', // Mock
          requesterName: 'Current User', // Mock
          role: formData.role || '',
          quantity: formData.quantity || 1,
          startDate: formData.startDate || '',
          endDate: formData.endDate || '',
          status: 'Pending',
          notes: formData.notes
      };

      dispatch({ type: 'RESOURCE_REQUEST_ADD', payload: request });
      
      setSuccessMsg(`Request ${request.id} submitted for approval.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setFormData({ role: '', quantity: 1, startDate: '', endDate: '', notes: '' });
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

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Role Required</label>
                <select 
                    className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                >
                    <option value="">Select Role...</option>
                    {state.roles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                </select>
            </div>
            <div>
                <label className={`${theme.typography.label} mb-1 block`}>Quantity</label>
                <Input 
                    type="number" 
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> Start Date</label>
                <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
            </div>
             <div>
                <label className={`${theme.typography.label} mb-1 block flex items-center gap-1`}><Calendar size={12}/> End Date</label>
                <Input 
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                />
            </div>
        </div>

        <div>
            <label className={`${theme.typography.label} mb-1 block`}>Skills / Certifications</label>
            <div className={`p-3 border ${theme.colors.border} rounded-lg flex flex-wrap gap-2 ${theme.colors.surface}`}>
                {state.skills.slice(0, 8).map(skill => (
                    <label key={skill.id} className={`flex items-center gap-2 text-sm ${theme.colors.background} px-2 py-1 rounded border ${theme.colors.border} cursor-pointer`}>
                        <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500"/> {skill.name}
                    </label>
                ))}
            </div>
        </div>

        <Button className="w-full" onClick={handleSubmit}>Submit Request</Button>
    </div>
  );
};
