
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, PieChart, Briefcase, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

export const PortfolioCommandBar: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useI18n();
    
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
          <button 
            onClick={() => navigate('/getting-started')}
            className={`p-6 rounded-[2rem] border border-dashed border-nexus-300 bg-nexus-50/20 hover:bg-nexus-50 hover:shadow-xl hover:border-nexus-400 transition-all flex items-center gap-5 group text-left relative overflow-hidden`}
          >
              <div className="w-14 h-14 rounded-2xl bg-white border border-nexus-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Globe className="text-nexus-600" size={24}/>
              </div>
              <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">{t('portfolio.provision', 'Provision Portfolio')}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Scale the Enterprise Project Structure (EPS)</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-nexus-600 transition-all group-hover:translate-x-1" />
          </button>

          <button 
            onClick={() => navigate('/programs/create')}
            className={`p-6 rounded-[2rem] border border-dashed border-purple-300 bg-purple-50/20 hover:bg-purple-50 hover:shadow-xl hover:border-purple-400 transition-all flex items-center gap-5 group text-left relative overflow-hidden`}
          >
              <div className="w-14 h-14 rounded-2xl bg-white border border-purple-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <PieChart className="text-purple-600" size={24}/>
              </div>
              <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Establish Program</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Orchestrate strategic delivery streams</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 transition-all group-hover:translate-x-1" />
          </button>

          <button 
             onClick={() => navigate('/projectList?action=create')}
             className={`p-6 rounded-[2rem] border border-dashed border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50 hover:shadow-xl hover:border-emerald-400 transition-all flex items-center gap-5 group text-left relative overflow-hidden`}
          >
              <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="text-emerald-600" size={24}/>
              </div>
              <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase">Initialize Project</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Launch individual tactical work packages</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
          </button>
      </div>
    );
};
