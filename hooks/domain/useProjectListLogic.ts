import { useState, useMemo, useDeferredValue, useTransition, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePortfolioState } from '../usePortfolioState';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';

export const useProjectListLogic = () => {
  const { projects } = usePortfolioState();
  const { dispatch } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [activeGroup, setActiveGroup] = useState('views');
  const [activeView, setActiveView] = useState('list');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setActiveView('create');
    }
  }, [searchParams]);

  const filteredProjects = useMemo(() => 
    projects.filter(p => 
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    ), 
  [projects, deferredSearchTerm]);

  const handleCreateProject = (newProject: Project) => {
    dispatch({ type: 'PROJECT_IMPORT', payload: [newProject] });
    startTransition(() => {
        // Remove action from URL after creation
        navigate('/projectList', { replace: true });
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