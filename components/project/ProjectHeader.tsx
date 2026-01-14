
import React from 'react';
import { Briefcase, GitBranch, GitMerge, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

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
          alert("Link copied to clipboard");
      }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <h1 className={`${theme.typography.h1} flex items-center`}>
          <Briefcase className="inline-block mr-3 text-nexus-600 mb-1" size={28} />
          {project.name}
        </h1>
        <p className={`${theme.colors.text.secondary} font-medium text-sm mt-1`}>{project.code} • {project.category}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleShare} className={`px-4 py-2 bg-white border ${theme.colors.border} ${theme.colors.text.secondary} rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2`}>
            <Share2 size={16}/> Share
        </button>
        {!project.isReflection && <Button onClick={onCreateReflection} variant="outline" size="sm" icon={GitBranch}>What-If Reflection</Button>}
        {project.isReflection && <Button onClick={onMergeReflection} variant="primary" size="sm" icon={GitMerge}>Merge Scenarios</Button>}
      </div>
    </div>
  );
};
