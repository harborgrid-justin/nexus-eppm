
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

type SubjectArea = 'Projects' | 'Tasks' | 'Risks';

const ALL_FIELDS: Record<SubjectArea, {id: string, label: string}[]> = {
    'Projects': [
        { id: 'code', label: 'Project Code' },
        { id: 'name', label: 'Project Name' },
        { id: 'managerId', label: 'Project Manager' },
        { id: 'health', label: 'Health' },
        { id: 'budget', label: 'Budget' },
        { id: 'spent', label: 'Spent' },
    ],
    'Tasks': [
        { id: 'wbsCode', label: 'WBS Code' },
        { id: 'name', label: 'Task Name' },
        { id: 'status', label: 'Status' },
        { id: 'startDate', label: 'Start Date' },
        { id: 'endDate', label: 'End Date' },
        { id: 'critical', label: 'Critical' },
    ],
    'Risks': [
        { id: 'id', label: 'Risk ID' },
        { id: 'description', label: 'Description' },
        { id: 'category', label: 'Category' },
        { id: 'score', label: 'Score' },
        { id: 'status', label: 'Status' },
        { id: 'ownerId', label: 'Owner' },
    ],
};

export const useReportBuilderLogic = () => {
  const { state } = useData();
  const { projects } = state;
  
  const [subjectArea, setSubjectArea] = useState<SubjectArea>('Projects');
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['code', 'name', 'managerId', 'health']));
  const [reportData, setReportData] = useState<Record<string, any>[] | null>(null);

  const availableColumns = useMemo(() => ALL_FIELDS[subjectArea], [subjectArea]);

  const handleColumnToggle = (id: string) => {
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(id)) {
        newSelection.delete(id);
    } else {
        newSelection.add(id);
    }
    setSelectedColumns(newSelection);
  };
  
  const handleGeneratePreview = () => {
    let data: any[] = [];
    if (subjectArea === 'Projects') {
      data = projects;
    } else if (subjectArea === 'Tasks') {
        data = state.projects.flatMap(p => p.tasks);
    } else if (subjectArea === 'Risks') {
        data = state.risks;
    }
    setReportData(data);
  };

  const previewData = useMemo(() => {
      if (!reportData) return null;
      return reportData.slice(0, 50); // Optimization: Limit preview to 50 rows
  }, [reportData]);

  const handleSubjectChange = (newSubject: SubjectArea) => {
      setSubjectArea(newSubject);
      setSelectedColumns(new Set()); // Reset columns on change
      setReportData(null);
  };

  return {
      subjectArea,
      selectedColumns,
      reportData,
      availableColumns,
      previewData,
      handleSubjectChange,
      handleColumnToggle,
      handleGeneratePreview
  };
};
