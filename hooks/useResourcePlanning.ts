
import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export const useResourcePlanning = () => {
  const { state } = useData();

  const skillMatrix = useMemo(() => {
    const matrix: Record<string, number> = {};
    state.resources.forEach(r => {
        r.skills.forEach(skill => {
            matrix[skill] = (matrix[skill] || 0) + 1;
        });
    });
    return Object.entries(matrix).map(([skill, count]) => ({ skill, count }));
  }, [state.resources]);

  const utilizationTrend = useMemo(() => {
     // Mock trend data
     return [
         { month: 'Jan', util: 85 },
         { month: 'Feb', util: 88 },
         { month: 'Mar', util: 92 },
         { month: 'Apr', util: 89 },
         { month: 'May', util: 94 },
         { month: 'Jun', util: 91 },
     ];
  }, []);

  return { skillMatrix, utilizationTrend };
};
