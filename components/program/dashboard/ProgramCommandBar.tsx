
import React from 'react';
import { Layers, Target, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgramCommandBarProps {
    onCreateProgram: () => void;
}

export const ProgramCommandBar: React.FC<ProgramCommandBarProps> = ({ onCreateProgram }) => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <button 
                onClick={onCreateProgram}
                className={`p-4 rounded-xl border border-dashed border-nexus-300 bg-nexus-50/50 hover:bg-nexus-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-nexus-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Layers className="text-nexus-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Initialize Program</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Group related projects & outcomes</p>
                  </div>
              </button>

              <button 
                onClick={() => navigate('/portfolio?tab=framework')}
                className={`p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Target className="text-purple-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Strategic Alignment</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Review organizational goals</p>
                  </div>
              </button>

              <button 
                onClick={() => navigate('/portfolio?tab=financials')}
                className={`p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <DollarSign className="text-emerald-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Funding Review</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Manage capital allocation</p>
                  </div>
              </button>
        </div>
    );
};
