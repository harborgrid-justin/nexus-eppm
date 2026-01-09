
import React, { useState } from 'react';
import { Project, WBSNode } from '../../types/index';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';
import { Briefcase, Calendar, DollarSign, Users, CheckCircle, ArrowRight, ArrowLeft, Plus, HardHat, Code, Sparkles, Loader2, AlertCircle, X, Shield, LayoutTemplate, Zap, Check } from 'lucide-react';
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
  
  const handleSeed = (type: 'construction' | 'software' | 'defense') => {
      // In a real app, 'defense' would map to a specific seed function
      // For now, we fallback to construction logic if defense is selected but handle the type
      dispatch({ type: 'LOAD_DEMO_PROJECT', payload: type as any }); 
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
    <div className="space-y-6 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
       <div className="grid grid-cols-2 gap-6">
          <div>
              <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Project Name</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Headquarters Expansion" className="h-12 text-lg" />
          </div>
          <div>
              <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Project Code</label>
              <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. P-2024-001" className="h-12 font-mono" />
          </div>
       </div>
       <div>
          <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Business Case</label>
          <textarea 
            className={`w-full p-4 border ${theme.colors.border} rounded-xl text-sm h-48 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary} resize-none`}
            placeholder="Why are we undertaking this project?"
            value={formData.businessCase}
            onChange={e => setFormData({...formData, businessCase: e.target.value})}
          />
       </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
        <div>
            <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Enterprise Project Structure (EPS)</label>
            <select 
                className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} ${theme.colors.text.primary} h-12 focus:ring-2 focus:ring-nexus-500 outline-none`}
                value={formData.epsId}
                onChange={e => setFormData({...formData, epsId: e.target.value})}
            >
                {state.eps.map(node => <option key={node.id} value={node.id}>{node.name}</option>)}
            </select>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Planned Start</label>
                <input type="date" className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} ${theme.colors.text.primary} h-12 focus:ring-2 focus:ring-nexus-500 outline-none`} value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
                <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Planned Finish</label>
                <input type="date" className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} ${theme.colors.text.primary} h-12 focus:ring-2 focus:ring-nexus-500 outline-none`} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
        </div>

        {validationError && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200 flex items-center gap-3">
                <AlertCircle size={18} /> {validationError}
            </div>
        )}
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Sparkles size={16} className="text-purple-500"/> AI Schedule Assistant</h4>
                <Button size="sm" variant="secondary" onClick={handleGenerateWBS} disabled={isGeneratingWBS}>
                    {isGeneratingWBS ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>} 
                    {isGeneratingWBS ? "Thinking..." : "Auto-Generate WBS"}
                </Button>
            </div>
            {generatedWBS ? (
                <div className="max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-sm">
                    {generatedWBS.map((node, i) => (
                        <div key={i} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                            <span className="font-mono font-bold text-slate-400 w-16">{node.wbsCode}</span>
                            <span className="text-slate-700 font-medium">{node.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                    Click to let AI structure your project deliverables based on the business case.
                </p>
            )}
        </div>
    </div>
  );

  const renderStep3 = () => (
      <div className="space-y-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
          <div className={`${theme.colors.background} p-8 rounded-2xl border ${theme.colors.border}`}>
              <label className={`block text-sm font-bold ${theme.colors.text.primary} mb-3 uppercase tracking-wider`}>Total Budget Authority</label>
              <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-3xl font-light">$</span>
                  <input 
                    type="number" 
                    className={`w-full pl-12 pr-6 py-6 text-4xl font-black ${theme.colors.text.primary} border-2 border-transparent hover:border-nexus-200 focus:border-nexus-500 rounded-xl ${theme.colors.surface} transition-all outline-none shadow-sm`}
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: parseFloat(e.target.value), originalBudget: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
              </div>
          </div>
          <div>
              <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Funding Source</label>
              <select className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} ${theme.colors.text.primary} h-12 focus:ring-2 focus:ring-nexus-500 outline-none`}>
                  <option>Internal CapEx</option>
                  <option>Grant / External</option>
                  <option>OpEx</option>
              </select>
          </div>
      </div>
  );

  const renderStep4 = () => (
      <div className="space-y-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
          <div>
              <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-2`}>Project Manager</label>
              <select 
                  className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm ${theme.colors.surface} ${theme.colors.text.primary} h-12 focus:ring-2 focus:ring-nexus-500 outline-none`}
                  value={formData.managerId}
                  onChange={e => setFormData({...formData, managerId: e.target.value})}
              >
                  <option value="">Select Manager...</option>
                  {state.resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
              </select>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <label className={`block text-sm font-bold ${theme.colors.text.secondary} mb-4`}>Core Charter Values</label>
              <div className="flex flex-wrap gap-3">
                  {['Transparency', 'Safety First', 'Innovation', 'Speed to Market', 'Customer Centric'].map(val => (
                      <button 
                        key={val}
                        onClick={() => {
                            const current = formData.teamCharter?.values || [];
                            const newVals = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
                            setFormData({...formData, teamCharter: { ...formData.teamCharter!, values: newVals }});
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                            formData.teamCharter?.values.includes(val) 
                            ? 'bg-nexus-600 border-nexus-600 text-white shadow-md transform scale-105' 
                            : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.tertiary} hover:border-nexus-300`
                        }`}
                      >
                          {val}
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  const TemplateCard = ({ icon: Icon, title, description, features, color, onClick, badge }: any) => (
    <div 
        onClick={onClick} 
        className={`relative p-6 ${theme.colors.surface} border border-slate-200 rounded-3xl flex flex-col cursor-pointer transition-all hover:shadow-xl hover:border-${color}-400 hover:-translate-y-1 group h-full`}
    >
        {badge && (
            <div className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-${color}-100 text-${color}-700`}>
                {badge}
            </div>
        )}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-${color}-50 text-${color}-600 border border-${color}-100 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28}/>
        </div>
        <h4 className={`font-bold text-lg ${theme.colors.text.primary} mb-2`}>{title}</h4>
        <p className={`text-xs ${theme.colors.text.secondary} leading-relaxed mb-6`}>{description}</p>
        
        <div className="mt-auto space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Includes</div>
            {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle size={12} className={`text-${color}-500`} /> {f}
                </div>
            ))}
        </div>
    </div>
  );

  const renderSelection = () => (
    <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
            <h3 className={`font-black ${theme.colors.text.primary} text-3xl mb-3 tracking-tight`}>Initialize Project</h3>
            <p className={`text-base ${theme.colors.text.secondary} max-w-2xl mx-auto`}>
                Select a baseline template to pre-configure your WBS, risk register, and phase gates, or start with a clean slate.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {/* Blank */}
            <div onClick={() => setMode('wizard')} className={`p-8 border-2 border-dashed ${theme.colors.border} rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-nexus-500 hover:bg-nexus-50/30 transition-all group ${theme.colors.surface} h-full min-h-[360px]`}>
                <div className={`w-20 h-20 ${theme.colors.background} rounded-full flex items-center justify-center mb-6 border ${theme.colors.border} group-hover:border-nexus-200 group-hover:scale-110 transition-all shadow-sm`}>
                    <Plus size={32} className={`text-slate-400 group-hover:text-nexus-600 transition-colors`}/>
                </div>
                <h4 className={`font-bold text-lg ${theme.colors.text.primary} mb-2`}>Start from Scratch</h4>
                <p className={`text-sm ${theme.colors.text.secondary} text-center max-w-[200px]`}>Configure project parameters, calendar, and structure manually.</p>
                <button className="mt-6 text-xs font-bold text-nexus-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Configure <ArrowRight size={12}/>
                </button>
            </div>

            {/* Templates */}
            <TemplateCard 
                icon={HardHat}
                title="Construction (EPC)"
                description="Standard Capital Project layout."
                color="orange"
                features={['CSI MasterFormat WBS', 'Physical % Complete', 'HSE Risk Register']}
                badge="Popular"
                onClick={() => handleSeed('construction')}
            />
            
            <TemplateCard 
                icon={Code}
                title="Software (Agile)"
                description="SaaS product development lifecycle."
                color="blue"
                features={['Sprint/Release Phases', 'Jira Integration Ready', 'Fixed Effort Tasks']}
                badge="SaaS"
                onClick={() => handleSeed('software')}
            />

             <TemplateCard 
                icon={Shield}
                title="Defense & Aero"
                description="DoD 5000.02 Compliance."
                color="indigo"
                features={['EVMS (ANSI-748)', 'Program Risk (5x5)', 'CDR/PDR Milestones']}
                badge="Gov"
                onClick={() => handleSeed('defense')}
            />
        </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] ${theme.colors.background} flex flex-col animate-in slide-in-from-bottom-4 duration-300`}>
        {/* Full Screen Header */}
        <div className={`flex items-center justify-between px-8 py-5 bg-white border-b ${theme.colors.border} shrink-0`}>
            <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-xl ${mode === 'wizard' ? 'bg-nexus-100 text-nexus-600' : 'bg-slate-100 text-slate-500'}`}>
                    {mode === 'wizard' ? <Briefcase size={24}/> : <LayoutTemplate size={24}/>}
                 </div>
                 <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        {mode === 'wizard' ? 'New Project Wizard' : 'Create New Initiative'}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {mode === 'wizard' ? 'Step-by-step configuration.' : 'Select a methodology to begin.'}
                    </p>
                 </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative">
             {mode === 'select' ? renderSelection() : (
                 <div className="flex flex-col h-full">
                     {/* Stepper Header */}
                     <div className="bg-white border-b border-slate-100 py-6">
                        <div className="max-w-3xl mx-auto px-8 relative">
                            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -z-10 rounded-full"></div>
                            <div className="flex justify-between">
                                {STEPS.map((step) => {
                                    const isActive = step.id === currentStep;
                                    const isComplete = step.id < currentStep;
                                    return (
                                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                                isActive ? 'border-nexus-600 bg-nexus-600 text-white shadow-lg ring-4 ring-nexus-50' :
                                                isComplete ? 'border-green-500 bg-green-500 text-white' :
                                                'border-slate-200 bg-white text-slate-300'
                                            }`}>
                                                {isComplete ? <CheckCircle size={18}/> : step.id}
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-nexus-700' : 'text-slate-400'}`}>{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                     </div>

                     <div className="flex-1 flex flex-col justify-center py-12 px-8">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                     </div>
                 </div>
             )}
        </div>

        {/* Footer */}
        {mode === 'wizard' && (
             <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center z-10 shrink-0">
                 <Button variant="ghost" onClick={handleBack} className="text-slate-500" size="lg">
                    <ArrowLeft className="mr-2 h-5 w-5"/> Back
                 </Button>
                 <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} size="lg">Cancel</Button>
                    {currentStep < STEPS.length ? (
                        <Button onClick={handleNext} size="lg" className="px-8">
                            Next Step <ArrowRight className="ml-2 h-5 w-5"/>
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} icon={CheckCircle} size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
                            Launch Project
                        </Button>
                    )}
                 </div>
             </div>
        )}
    </div>
  );
};

export default ProjectWizard;
