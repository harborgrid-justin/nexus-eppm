import React from 'react';
import { Map as MapIcon, Link, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { DependencyLog } from './roadmap/DependencyLog';
import { DependencyForm } from './roadmap/DependencyForm';
import { usePortfolioRoadmapLogic } from '../../hooks/domain/usePortfolioRoadmapLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';

const PortfolioRoadmap: React.FC = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const { lanes, projects, isDependencyModalOpen, setIsDependencyModalOpen, handleEditAlignment, handleQuickAlign, handleAddDependency } = usePortfolioRoadmapLogic();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-10 animate-in fade-in`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className={`${theme.typography.h2} flex items-center gap-2`}><MapIcon className="text-nexus-600" /> {t('portfolio.roadmap_title', 'Strategic Portfolio Roadmap')}</h2>
                <p className={theme.typography.small}>{t('portfolio.roadmap_subtitle', 'Long-range visualization of aligned drivers.')}</p>
            </div>
            <Button variant="outline" size="sm" icon={Link} onClick={() => setIsDependencyModalOpen(true)}>{t('portfolio.dep_define', 'Define Dependency')}</Button>
        </div>

        {projects.length > 0 ? (
            <>
                <section><RoadmapTimeline lanes={lanes} projects={projects} onEditAlignment={handleEditAlignment} onQuickAlign={handleQuickAlign} /></section>
                <section><DependencyLog onAdd={() => setIsDependencyModalOpen(true)} /></section>
            </>
        ) : (
            <EmptyGrid title={t('portfolio.roadmap_empty', 'Roadmap Context Neutral')} description={t('portfolio.roadmap_empty_desc', 'Populate the ledger to visualize the long-range plan.')} icon={MapIcon} actionLabel={t('project.init_action', 'Initialize Initiative')} onAdd={() => {}} />
        )}

        <DependencyForm isOpen={isDependencyModalOpen} onClose={() => setIsDependencyModalOpen(false)} onSave={handleAddDependency} projects={projects} />
    </div>
  );
};
export default PortfolioRoadmap;