
import React, { useState } from 'react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { 
  Briefcase, Calendar, DollarSign, Users, CheckCircle, ArrowRight, ArrowLeft, 
  Save, X, Shield, Target, Layers 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';

interface ProjectCreatePageProps {
  onClose: () => void;
  onSave: (project: Project) => void;
}

const STEPS = [
  { id: 1, label: 'Project Identity', description: 'Name, code, and ownership', icon: Briefcase },
  { id: 2, label: 'Structure & Schedule', description: 'EPS, dates, and calendar', icon: Calendar },
  { id: 3, label: 'Financial Baseline', description: 'Budget and funding sources', icon: DollarSign },
  { id: 4, label: 'Charter & Strategy', description: 'Business case and alignment', icon: Target },
];

const ProjectCreatePage: React.FC<ProjectCreatePageProps> = ({ onClose, onSave }) => {
  const { state } = useData();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    code: '',
    description: '',
    status: 'Planned',
    health: 'Good',
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    manager: '',
    epsId: state.eps[0]?.id || '',
    category: 'General',
    strategicImportance: 5,
    businessCase: '',
    teamCharter: {
        values: ['Transparency', 'Safety'],
        communicationGuidelines: 'Weekly Status Reports',
        decisionMakingProcess: 'PM Authority',
        conflictResolutionProcess: 'Escalation to Sponsor'
    }
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.code) {
        alert("Project Name and Code are required.");
        return;
    }

    const newProject: Project = {
      id: generateId('P'),
      ...formData as Project,
      spent: 0,
      tasks: [], 
      // Defaults
      financialValue: 0,
      riskScore: 0,
      resourceFeasibility: 5,
      calculatedPriorityScore: 50,
      obsId: 'OBS-ROOT',
      calendarId: 'CAL-STD',
      risks: []
    };
    onSave(newProject);
  };

  const updateField = (field: keyof Project, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- RENDER STEPS ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Briefcase size={20} className="text-nexus-600"/> General Information
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                  <Input 
                    value={formData.name} 
                    onChange={e => updateField('name', e.target.value)} 
                    placeholder="e.g. Headquarters Expansion" 
                    autoFocus
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Project Code <span className="text-red-500">*</span></label>
                  <Input 
                    value={formData.code} 
                    onChange={e => updateField('code', e.target.value)} 
                    placeholder="e.g. P-2024-001" 
                  />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Project Manager</label>
                  <select 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                      value={formData.manager}
                      onChange={e => updateField('manager', e.target.value)}
                  >
                      <option value="">Select Manager...</option>
                      {state.resources.map(r => <option key={r.id} value={r.name}>{r.name} ({r.role})</option>)}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <select 
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                      value={formData.category}
                      onChange={e => updateField('category', e.target.value)}
                  >
                      <option>General</option>
                      <option>Infrastructure</option>
                      <option>IT / Software</option>
                      <option>Regulatory</option>
                      <option>R&D</option>
                  </select>
              </div>
           </div>
       </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers size={20} className="text-nexus-600"/> Hierarchy & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Enterprise Project Structure (EPS)</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.epsId}
                        onChange={e => updateField('epsId', e.target.value)}
                    >
                        {state.eps.map(node => <option key={node.id} value={node.id}>{node.name}</option>)}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Determines portfolio aggregation logic.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Organization (OBS)</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.obsId}
                        onChange={e => updateField('obsId', e.target.value)}
                    >
                        {state.obs.map(node => <option key={node.id} value={node.id}>{node.name}</option>)}
                    </select>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-nexus-600"/> Schedule Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Planned Start</label>
                    <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none" value={formData.startDate} onChange={e => updateField('startDate', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Planned Finish</label>
                    <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none" value={formData.endDate} onChange={e => updateField('endDate', e.target.value)} />
                </div>
            </div>
        </div>
    </div>
  );

  const renderStep3 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600"/> Budget Authorization
              </h3>
              
              <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Total Approved Budget</label>
                  <div className="relative max-w-md">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                      <input 
                        type="number" 
                        className="w-full pl-8 pr-4 py-3 text-2xl font-mono font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.budget}
                        onChange={e => {
                            const val = parseFloat(e.target.value);
                            updateField('budget', val);
                            updateField('originalBudget', val);
                        }}
                        placeholder="0.00"
                      />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Funding Source</label>
                    <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none">
                        <option>Internal CapEx</option>
                        <option>Grant / External</option>
                        <option>OpEx</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Currency</label>
                    <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none" disabled>
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                    </select>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderStep4 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Target size={20} className="text-red-500"/> Strategic Definition
             </h3>
             <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-1">Business Case</label>
                <textarea 
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none"
                    placeholder="Justification for the project..."
                    value={formData.businessCase}
                    onChange={e => updateField('businessCase', e.target.value)}
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Strategic Importance (1-10)</label>
                <div className="flex items-center gap-4">
                    <input 
                        type="range" min="1" max="10" 
                        value={formData.strategicImportance}
                        onChange={e => updateField('strategicImportance', parseInt(e.target.value))}
                        className="w-full max-w-md h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                    />
                    <span className="font-bold text-xl text-nexus-700">{formData.strategicImportance}</span>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Shield size={20} className="text-blue-500"/> Team Charter Values
             </h3>
             <div className="flex flex-wrap gap-2">
                  {['Transparency', 'Safety', 'Innovation', 'Speed', 'Quality', 'Sustainability'].map(val => (
                      <button 
                        key={val}
                        onClick={() => {
                            const current = formData.teamCharter?.values || [];
                            const newVals = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
                            setFormData({...formData, teamCharter: { ...formData.teamCharter!, values: newVals }});
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                            formData.teamCharter?.values.includes(val) 
                            ? 'bg-nexus-100 border-nexus-500 text-nexus-700' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                          {val}
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen overflow-hidden animate-in fade-in duration-200">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0 z-20">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-nexus-100 rounded-lg text-nexus-600">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Create New Project</h1>
                    <p className="text-xs text-slate-500">Initiate a new entry in the portfolio</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onClose} className="text-slate-500">Save Draft</Button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar: Stepper */}
            <div className="w-80 bg-white border-r border-slate-200 p-8 flex-shrink-0 hidden md:block overflow-y-auto">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
                    
                    <div className="space-y-8">
                        {STEPS.map((step, idx) => {
                            const isCompleted = step.id < currentStep;
                            const isActive = step.id === currentStep;
                            
                            return (
                                <div key={step.id} className="flex gap-4 group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                                        isActive ? 'border-nexus-600 bg-white text-nexus-600 shadow-md ring-2 ring-nexus-100' :
                                        isCompleted ? 'border-green-500 bg-green-500 text-white' :
                                        'border-slate-200 bg-white text-slate-300'
                                    }`}>
                                        {isCompleted ? <CheckCircle size={16}/> : step.id}
                                    </div>
                                    <div className={`${isActive ? 'opacity-100' : 'opacity-60'} transition-opacity`}>
                                        <p className={`font-bold text-sm ${isActive ? 'text-nexus-700' : 'text-slate-700'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-12 relative">
                <div className="max-w-3xl mx-auto pb-24">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center z-20">
            <Button 
                variant="secondary" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className="w-32"
            >
                <ArrowLeft size={16} className="mr-2"/> Back
            </Button>
            
            <div className="flex gap-4">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                {currentStep < STEPS.length ? (
                    <Button onClick={handleNext} className="w-32">
                        Next <ArrowRight size={16} className="ml-2"/>
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} icon={CheckCircle} className="w-40">
                        Create Project
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProjectCreatePage;
