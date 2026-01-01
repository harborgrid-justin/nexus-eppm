
import { useData } from '../context/DataContext';

export const useDocuments = (projectId: string) => {
  const { state } = useData();
  const documents = state.documents.filter(d => d.projectId === projectId);
  
  return { documents, count: documents.length };
};
