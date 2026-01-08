
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

  // Optimization: Native Web Share API
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
          // Fallback to Clipboard API
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard");
      }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <div>
        <h1 className={`text-3xl font-black tracking-tighter ${theme.colors.text.primary}`}>
          <Briefcase className="inline-block mr-3 text-nexus-600 mb-1" size={28} />
          {project.name}
        </h1>
        <p className={`${theme.colors.text.secondary} font-medium text-sm mt-1`}>{project.code} • {project.category}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleShare} variant="ghost" size="sm" icon={Share2}>Share</Button>
        {!project.isReflection && <Button onClick={onCreateReflection} variant="outline" size="sm" icon={GitBranch}>What-If Reflection</Button>}
        {project.isReflection && <Button onClick={onMergeReflection} variant="primary" size="sm" icon={GitMerge}>Merge Scenarios</Button>}
      </div>
    </div>
  );
};
