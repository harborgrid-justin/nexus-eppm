import React from 'react';
import { Map as MapIcon, Link, Plus, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { DependencyLog } from './roadmap/DependencyLog';
import { DependencyForm } from './roadmap/DependencyForm';
import { usePortfolioRoadmapLogic } from '../../hooks/domain/usePortfolioRoadmapLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
// Added missing useNavigate import to fix "Cannot find name 'navigate'" error on line 56
import { useNavigate } from 'react-router-dom';

const PortfolioRoadmap: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  // Initialized navigate variable via useNavigate hook
  const navigate = useNavigate();
  const { lanes, projects, isDependencyModalOpen, setIsDependencyModalOpen, handleEditAlignment, handleQuickAlign, handleAddDependency } = usePortfolioRoadmapLogic();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-10 animate-in fade-in duration-500 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700"><MapIcon size={24}/></div>
                <div>
                    <h2 className={`${theme.typography.h1} tracking-tight`}>{t('portfolio.roadmap_title', 'Integrated Strategic Roadmap')}</h2>
                    <p className={theme.typography.small}>{t('portfolio.roadmap_subtitle', 'Consolidated long-range visualization of enterprise initiatives.')}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={Link} onClick={() => setIsDependencyModalOpen(true)}>{t('portfolio.dep_define', 'Link Components')}</Button>
                <Button variant="primary" size="sm" icon={Plus} onClick={() => {}}>New Strategy Track</Button>
            </div>
        </div>

        {projects.length > 0 ? (
            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Target size={16} className="text-nexus-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Initiative Distribution</h3>
                    </div>
                    <RoadmapTimeline lanes={lanes} projects={projects} onEditAlignment={handleEditAlignment} onQuickAlign={handleQuickAlign} />
                </section>
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Link size={16} className="text-nexus-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Logic & Dependencies</h3>
                    </div>
                    <DependencyLog onAdd={() => setIsDependencyModalOpen(true)} />
                </section>
            </div>
        ) : (
            <EmptyGrid 
                title={t('portfolio.roadmap_empty', 'Roadmap Context Null')} 
                description={t('portfolio.roadmap_empty_desc', 'Populate the organizational ledger to visualize the long-range integrated roadmap.')} 
                icon={MapIcon} 
                actionLabel={t('project.init_action', 'Initialize Pilot Project')} 
                onAdd={() => navigate('/projectList?action=create')} 
            />
        )}

        <DependencyForm isOpen={isDependencyModalOpen} onClose={() => setIsDependencyModalOpen(false)} onSave={handleAddDependency} projects={projects} />
    </div>
  );
};

export default PortfolioRoadmap;
