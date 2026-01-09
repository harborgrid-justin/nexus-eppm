
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Project, WBSNode } from '../../types/index';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { Briefcase, Calendar, DollarSign, Users, CheckCircle, ArrowRight, ArrowLeft, Plus, HardHat, Code, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';
import { generateWBS } from '../../services/geminiService';

interface ProjectWizardProps {
  onClose: () => void;
  onSave: (project: Project) => void;
}

const STEPS = [
  { id: 1, label: 'General Info', icon: Briefcase },
  { id: 2, label: 'Schedule & EPS', icon: Calendar },
  { id: 3, label: 'Financial Baseline', icon: DollarSign },
  { id: 4, label: 'Team Charter', icon: Users },
];

const ProjectWizard: React.FC<ProjectWizardProps> = ({ onClose, onSave }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const [mode, setMode] = useState<'select' | 'wizard'>('select');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingWBS, setIsGeneratingWBS] = useState(false);
  const [generatedWBS, setGeneratedWBS] = useState<any[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    code: '',
    description: '',
    status: 'Planned',
    health: 'Good',
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    managerId: '',
    epsId: state.eps[0]?.id || '',
    tasks: [],
    risks: [],
    teamCharter: {
        values: [],
        communicationGuidelines: 'Weekly Status Reports',
        decisionMakingProcess: 'PM Authority',
        conflictResolutionProcess: 'Escalation to Sponsor'
    }
  });

  const validateDates = () => {
      if (formData.startDate && formData.endDate) {
          if (new Date(formData.endDate) < new Date(formData.startDate)) {
              setValidationError("Planned Finish date cannot be before Start date.");
              return false;
          }
      }
      setValidationError(null);
      return true;
  };

  const handleNext = () => {
      if (currentStep === 2 && !validateDates()) return;
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setMode('select');
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };
  
  const handleSeed = (type: 'construction' | 'software') => {
      dispatch({ type: 'LOAD_DEMO_PROJECT', payload: type });
      onClose();
  };

  const handleGenerateWBS = async () => {
      if (!formData.name) {
          alert("Please enter a project name first.");
          return;
      }
      setIsGeneratingWBS(true);
      try {
          const wbsNodes = await generateWBS(formData.name, formData.businessCase || "Standard project");
          setGeneratedWBS(wbsNodes);
          
          // Convert flat AI response to WBSNode structure (Simplified for demo)
          const convertedWbs: WBSNode[] = wbsNodes.map((n, i) => ({
              id: generateId('WBS'),
              wbsCode: n.wbsCode || `${i+1}`,
              name: n.name,
              description: n.description || '',
              children: []
          }));
          
          setFormData(prev => ({
              ...prev,
              wbs: convertedWbs
          }));
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingWBS(false);
      }
  };

  const handleSubmit = () => {
    if (!validateDates()) return;

    const newProject: Project = {
      id: generateId('P'),
      ...formData as Project,
      spent: 0,
      tasks: [], 
      // Defaults for missing required fields
      strategicImportance: 5,
      financialValue: 0,
      riskScore: 0,
      resourceFeasibility: 5,
      calculatedPriorityScore: 50,
      category: 'General',
      obsId: 'OBS-ROOT',
      calendarId: 'CAL-STD'
    };
    onSave(newProject);
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Project Name</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Headquarters Expansion" />
          </div>
          <div>
              <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Project Code</label>
              <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. P-2024-001" />
          </div>
       </div>
       <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Business Case</label>
          <textarea 
            className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary}`}
            placeholder="Why are we undertaking this project?"
            value={formData.businessCase}
            onChange={e => setFormData({...formData, businessCase: e.target.value})}
          />
       </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
        <div>
            <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Enterprise Project Structure (EPS)</label>
            <select 
                className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`}
                value={formData.epsId}
                onChange={e => setFormData({...formData, epsId: e.target.value})}
            >
                {state.eps.map(node => <option key={node.id} value={node.id}>{node.name}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Planned Start</label>
                <input type="date" className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`} value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
                <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Planned Finish</label>
                <input type="date" className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
        </div>

        {validationError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200 flex items-center gap-2">
                <AlertCircle size={14} /> {validationError}
            </div>
        )}
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Sparkles size={14} className="text-purple-500"/> AI Schedule Assistant</h4>
                <Button size="sm" variant="secondary" onClick={handleGenerateWBS} disabled={isGeneratingWBS}>
                    {isGeneratingWBS ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>} 
                    {isGeneratingWBS ? "Thinking..." : "Auto-Generate WBS"}
                </Button>
            </div>
            {generatedWBS ? (
                <div className="max-h-32 overflow-y-auto bg-white border border-slate-200 rounded-lg p-2 text-xs">
                    {generatedWBS.map((node, i) => (
                        <div key={i} className="flex gap-2 py-1 border-b border-slate-50 last:border-0">
                            <span className="font-mono font-bold text-slate-500">{node.wbsCode}</span>
                            <span className="text-slate-800">{node.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-slate-500 italic">
                    Click to let AI structure your project deliverables based on the business case.
                </p>
            )}
        </div>
    </div>
  );

  const renderStep3 = () => (
      <div className="space-y-6">
          <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
              <label className={`block text-sm font-bold ${theme.colors.text.primary} mb-2`}>Total Budget Authority</label>
              <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input 
                    type="number" 
                    className={`w-full pl-8 pr-4 py-3 text-xl font-bold ${theme.colors.text.primary} border ${theme.colors.border} rounded-lg ${theme.colors.surface}`}
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: parseFloat(e.target.value), originalBudget: parseFloat(e.target.value)})}
                  />
              </div>
          </div>
          <div>
              <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Funding Source</label>
              <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`}>
                  <option>Internal CapEx</option>
                  <option>Grant / External</option>
                  <option>OpEx</option>
              </select>
          </div>
      </div>
  );

  const renderStep4 = () => (
      <div className="space-y-4">
          <div>
              <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Project Manager</label>
              <select 
                  className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary}`}
                  value={formData.managerId}
                  onChange={e => setFormData({...formData, managerId: e.target.value})}
              >
                  <option value="">Select Manager...</option>
                  {state.resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
              </select>
          </div>
          <div>
              <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-1`}>Initial Charter Values</label>
              <div className="flex gap-2">
                  {['Transparency', 'Safety', 'Innovation', 'Speed'].map(val => (
                      <button 
                        key={val}
                        onClick={() => {
                            const current = formData.teamCharter?.values || [];
                            const newVals = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
                            setFormData({...formData, teamCharter: { ...formData.teamCharter!, values: newVals }});
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            formData.teamCharter?.values.includes(val) 
                            ? 'bg-nexus-100 border-nexus-200 text-nexus-700' 
                            : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.tertiary}`
                        }`}
                      >
                          {val}
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderSelection = () => (
    <div className="animate-in fade-in duration-300 py-6">
        <h3 className={`text-center font-bold ${theme.colors.text.primary} text-lg mb-2`}>How would you like to start?</h3>
        <p className={`text-center text-sm ${theme.colors.text.secondary} mb-8`}>Create a project from scratch or load a pre-built industry template.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => setMode('wizard')} className={`p-8 border-2 border-dashed ${theme.colors.border} rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer hover:border-nexus-500 hover:bg-nexus-50 transition-all group ${theme.colors.surface}`}>
                <div className={`w-16 h-16 ${theme.colors.background} rounded-full flex items-center justify-center mb-4 border ${theme.colors.border} group-hover:border-nexus-200 transition-all`}>
                    <Plus size={32} className={`text-slate-400 group-hover:text-nexus-600 transition-colors`}/>
                </div>
                <h4 className={`font-bold ${theme.colors.text.primary}`}>Start from Scratch</h4>
                <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>Build a new project with the wizard.</p>
            </div>
            <div onClick={() => handleSeed('construction')} className={`p-8 ${theme.colors.surface} border ${theme.colors.border} rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer hover:border-nexus-500 hover:shadow-lg transition-all group`}>
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200"><HardHat size={32} className="text-amber-600"/></div>
                <h4 className={`font-bold ${theme.colors.text.primary}`}>Construction Demo</h4>
                <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>A large-scale infrastructure project.</p>
            </div>
            <div onClick={() => handleSeed('software')} className={`p-8 ${theme.colors.surface} border ${theme.colors.border} rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer hover:border-nexus-500 hover:shadow-lg transition-all group`}>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-200"><Code size={32} className="text-blue-600"/></div>
                <h4 className={`font-bold ${theme.colors.text.primary}`}>Software Development</h4>
                <p className={`text-xs ${theme.colors.text.secondary} mt-1`}>An agile ERP migration project.</p>
            </div>
        </div>
    </div>
  );

  return (
    <Modal
        isOpen={true}
        onClose={onClose}
        title={mode === 'wizard' ? <span className="flex items-center gap-2"><Briefcase className="text-nexus-600"/> New Project Wizard</span> : 'Create New Project'}
        size={mode === 'wizard' ? 'lg' : '2xl'}
        footer={
            mode === 'wizard' ? (
                <div className="flex justify-between w-full">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        {currentStep < STEPS.length ? (
                            <Button onClick={handleNext}>
                                Next <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} icon={CheckCircle}>
                                Create Project
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex justify-end w-full">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </div>
            )
        }
    >
        {mode === 'select' ? renderSelection() : (
            <div className="flex flex-col h-[400px]">
                {/* Stepper */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
                    {STEPS.map((step) => {
                        const isActive = step.id === currentStep;
                        const isComplete = step.id < currentStep;
                        return (
                            <div key={step.id} className={`flex flex-col items-center gap-2 ${theme.colors.surface} px-2`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                    isActive ? 'border-nexus-600 bg-nexus-50 text-nexus-600' :
                                    isComplete ? 'border-green-50 bg-green-50 text-green-600' :
                                    'border-slate-300 text-slate-400'
                                }`}>
                                    {isComplete ? <CheckCircle size={16}/> : step.id}
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-nexus-700' : 'text-slate-500'}`}>{step.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>
            </div>
        )}
    </Modal>
  );
};

export default ProjectWizard;
