
import React from 'react';
import { Layers, Target, DollarSign, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useI18n } from '../../../context/I18nContext';

interface ProgramCommandBarProps {
    onCreateProgram: () => void;
}

export const ProgramCommandBar: React.FC<ProgramCommandBarProps> = ({ onCreateProgram }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useI18n();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <button 
                onClick={onCreateProgram}
                className={`p-6 rounded-[2rem] border border-dashed border-nexus-300 bg-nexus-50/20 hover:bg-nexus-50 hover:shadow-xl hover:border-nexus-400 transition-all flex items-center gap-6 group text-left relative overflow-hidden`}
              >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-nexus-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Layers className="text-nexus-600" size={24}/>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Initialize Program</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Cluster multi-project delivery streams</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-nexus-600 transition-all group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => navigate('/portfolio?view=framework')}
                className={`p-6 rounded-[2rem] border border-dashed border-purple-300 bg-purple-50/20 hover:bg-purple-50 hover:shadow-xl hover:border-purple-400 transition-all flex items-center gap-5 group text-left relative overflow-hidden`}
              >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Target className="text-purple-600" size={24}/>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Strategic Weights</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Audit organizational alignment criteria</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 transition-all group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => navigate('/portfolio?view=financials')}
                className={`p-6 rounded-[2rem] border border-dashed border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50 hover:shadow-xl hover:border-emerald-400 transition-all flex items-center gap-6 group text-left relative overflow-hidden`}
              >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <DollarSign className="text-emerald-600" size={24}/>
                  </div>
                  <div>
                      <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Capital Allotment</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Rebalance cross-program funding</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
              </button>
        </div>
    );
};
