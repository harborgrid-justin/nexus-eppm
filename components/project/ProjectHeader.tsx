import React from 'react';
import { Briefcase, GitBranch, GitMerge, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { formatInitials } from '../../utils/formatters';

interface Props {
  project: any;
  onCreateReflection: () => void;
  onMergeReflection: () => void;
}

export const ProjectHeader: React.FC<Props> = ({ project, onCreateReflection, onMergeReflection }) => {
  const theme = useTheme();

  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: `Nexus Project: ${project.name}`,
                  text: `Check out the status of ${project.name} on Nexus PPM.`,
                  url: window.location.href
              });
          } catch (error) {
              console.log('Error sharing:', error);
          }
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Share link copied to system clipboard.");
      }
  };

  const projectInitials = project?.name ? formatInitials(project.name) : 'P';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-5 min-w-0">
        <div className={`w-14 h-14 rounded-2xl ${theme.colors.primary} flex items-center justify-center text-white font-black text-xl shadow-xl shadow-nexus-500/20 border border-white/10 shrink-0`}>
           {projectInitials}
        </div>
        <div className="min-w-0">
            <h1 className={`${theme.typography.h1} flex items-center tracking-tighter truncate uppercase`}>
            {project.name || 'Untitled Project'}
            </h1>
            <p className={`${theme.colors.text.tertiary} font-bold text-xs mt-1 uppercase tracking-[0.2em]`}>{project.code || 'NO_CODE'} • {project.category || 'General'}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap shrink-0">
        <button 
            onClick={handleShare} 
            className={`px-4 py-2 bg-white border ${theme.colors.border} ${theme.colors.text.secondary} rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95`}
        >
            <Share2 size={14}/> Share Hub
        </button>
        {!project.isReflection && (
            <Button onClick={onCreateReflection} variant="outline" size="sm" icon={GitBranch} className="font-black uppercase tracking-widest text-[10px]">
                Initiate Reflection
            </Button>
        )}
        {project.isReflection && (
            <Button onClick={onMergeReflection} variant="primary" size="sm" icon={GitMerge} className="font-black uppercase tracking-widest text-[10px]">
                Commit Reflection
            </Button>
        )}
      </div>
    </div>
  );
};