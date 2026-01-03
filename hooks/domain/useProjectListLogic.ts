
import { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioState } from '../usePortfolioState';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';

export const useProjectListLogic = () => {
  const { projects } = usePortfolioState();
  const { dispatch } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [activeGroup, setActiveGroup] = useState('views');
  const [activeView, setActiveView] = useState('list');
  const [isPending, startTransition] = useTransition();

  const filteredProjects = useMemo(() => 
    projects.filter(p => 
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    ), 
  [projects, deferredSearchTerm]);

  const handleCreateProject = (newProject: Project) => {
    dispatch({ type: 'PROJECT_IMPORT', payload: [newProject] });
    startTransition(() => {
        setActiveView('list');
    });
  };

  const handleSelectProject = (projectId: string) => {
    navigate(`/projectWorkspace/${projectId}`);
  };

  const handleViewChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

  return {
      searchTerm,
      setSearchTerm,
      deferredSearchTerm,
      activeGroup,
      activeView,
      setActiveView,
      isPending,
      filteredProjects,
      handleCreateProject,
      handleSelectProject,
      handleViewChange
  };
};
