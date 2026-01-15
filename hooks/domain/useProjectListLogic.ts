
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
    if (searchParams.get('action') === 'create') setActiveView('create');
  }, [searchParams]);

  const filteredProjects = useMemo(() => 
    projects.filter(p => 
      p.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    ), 
  [projects, deferredSearchTerm]);

  return {
      searchTerm, setSearchTerm, deferredSearchTerm, activeGroup, activeView,
      setActiveView, isPending, filteredProjects,
      handleCreateProject: (p: Project) => { dispatch({ type: 'PROJECT_IMPORT', payload: [p] }); setActiveView('list'); },
      handleSelectProject: (id: string) => navigate(`/projectWorkspace/${id}`),
      handleViewChange: (vid: string) => startTransition(() => setActiveView(vid))
  };
};
