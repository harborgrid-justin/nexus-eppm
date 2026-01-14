import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, PieChart, Briefcase } from 'lucide-react';
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
            className={`p-5 rounded-2xl border border-dashed border-nexus-300 bg-nexus-50/50 hover:bg-nexus-50 transition-all flex items-center gap-4 group text-left shadow-sm`}
          >
              <div className="w-12 h-12 rounded-xl bg-white border border-nexus-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Globe className="text-nexus-600" size={24}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-base">{t('portfolio.provision', 'Provision Portfolio')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{t('portfolio.eps_desc', 'Establish Enterprise Project Structure (EPS)')}</p>
              </div>
          </button>

          <button 
            onClick={() => navigate('/programs/create')}
            className={`p-5 rounded-2xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left shadow-sm`}
          >
              <div className="w-12 h-12 rounded-xl bg-white border border-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <PieChart className="text-purple-600" size={24}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-base">{t('nav.programs_init', 'Establish Program')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{t('portfolio.program_desc', 'Aggregate cross-project delivery streams')}</p>
              </div>
          </button>

          <button 
             onClick={() => navigate('/projectList?action=create')}
             className={`p-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center gap-4 group text-left shadow-sm`}
          >
              <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase className="text-emerald-600" size={24}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-base">{t('nav.projects_init', 'Initialize Project')}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{t('portfolio.project_desc', 'Launch individual work packages')}</p>
              </div>
          </button>
      </div>
    );
};