
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ShieldAlert, Target } from 'lucide-react';

export const PortfolioCommandBar: React.FC = () => {
    const navigate = useNavigate();
    return (
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/projectList?action=create')}
            className={`p-4 rounded-xl border border-dashed border-nexus-300 bg-nexus-50/50 hover:bg-nexus-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-nexus-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Briefcase className="text-nexus-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Initiate Project</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Start a new charter from template</p>
              </div>
          </button>

          <button 
            onClick={() => navigate('/enterpriseRisks?view=register')}
            className={`p-4 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-orange-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldAlert className="text-orange-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Log Strategic Risk</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Escalate threat to portfolio level</p>
              </div>
          </button>

          <button 
             onClick={() => navigate('/portfolio?tab=scenarios')}
             className={`p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left`}
          >
              <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Target className="text-purple-600" size={18}/>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800 text-sm">Model Scenario</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Run what-if analysis on budget</p>
              </div>
          </button>
      </div>
    );
};
