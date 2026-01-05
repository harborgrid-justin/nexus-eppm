
import { DataState, Action, StagingRecord } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { Project, Task, Resource, TaskStatus } from '../../types';

export const stagingReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'STAGING_INIT': {
        const { type, data } = action.payload;
        // Transform raw data into StagingRecord shape
        const records: StagingRecord[] = data.map((row: any, idx: number) => {
            const errors: string[] = [];
            
            // Basic Validation based on type
            if (type === 'Project') {
                if (!row.Name) errors.push('Missing Name');
                if (row.Budget && isNaN(Number(row.Budget))) errors.push('Invalid Budget');
            } else if (type === 'Task') {
                if (!row.Name) errors.push('Missing Name');
            }

            return {
                id: `STG-${idx}-${Date.now()}`,
                data: row,
                status: errors.length > 0 ? 'Error' : 'Valid',
                errors,
                selected: true
            };
        });

        const validCount = records.filter(r => r.status === 'Valid').length;
        
        return {
            ...state,
            staging: {
                ...state.staging,
                entityType: type,
                records,
                summary: {
                    total: records.length,
                    valid: validCount,
                    error: records.length - validCount
                },
                activeImportId: `IMP-${Date.now()}`
            }
        };
    }

    case 'STAGING_UPDATE_RECORD': {
        const { id, data } = action.payload;
        const records = state.staging.records.map(r => {
            if (r.id === id) {
                // Re-validate logic here
                const errors: string[] = [];
                if (state.staging.entityType === 'Project' && !data.Name) errors.push('Missing Name');
                if (state.staging.entityType === 'Task' && !data.Name) errors.push('Missing Name');
                
                return {
                    ...r,
                    data: { ...r.data, ...data },
                    status: errors.length > 0 ? 'Error' : 'Valid',
                    errors
                } as StagingRecord;
            }
            return r;
        });

        return {
            ...state,
            staging: {
                ...state.staging,
                records,
                summary: {
                    total: records.length,
                    valid: records.filter(r => r.status === 'Valid').length,
                    error: records.filter(r => r.status === 'Error').length
                }
            }
        };
    }

    case 'STAGING_COMMIT_SELECTED': {
        // Commit valid records to the main store
        const { entityType, records } = state.staging;
        const validRecords = records.filter(r => r.status === 'Valid' && r.selected);
        
        let newState = { ...state };

        if (entityType === 'Project') {
            const newProjects: Project[] = validRecords.map(r => ({
                id: generateId('P'),
                name: r.data.Name,
                code: r.data.ID || generateId('P'),
                budget: Number(r.data.Budget) || 0,
                spent: 0,
                status: r.data.Status || 'Planned',
                health: 'Good',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                managerId: 'Unassigned',
                epsId: 'EPS-ROOT',
                obsId: 'OBS-ROOT',
                calendarId: 'CAL-STD',
                strategicImportance: 5,
                financialValue: 5,
                riskScore: 0,
                resourceFeasibility: 5,
                calculatedPriorityScore: 50,
                category: 'General',
                tasks: []
            } as Project));
            
            newState.projects = [...state.projects, ...newProjects];
        } 
        else if (entityType === 'Task') {
            // For Tasks, we default to adding them to the first project if no Project ID is mapped
            // In a real app, mapping would handle Project ID association
            const targetProjectId = state.projects[0]?.id;
            
            if (targetProjectId) {
                const newTasks: Task[] = validRecords.map(r => ({
                    id: generateId('T'),
                    wbsCode: r.data.WBS || '1',
                    name: r.data.Name,
                    startDate: r.data.Start || new Date().toISOString().split('T')[0],
                    endDate: r.data.Finish || new Date().toISOString().split('T')[0],
                    duration: Number(r.data.Duration) || 1,
                    status: TaskStatus.NOT_STARTED,
                    progress: 0,
                    dependencies: [],
                    critical: false,
                    type: 'Task',
                    effortType: 'Fixed Duration',
                    assignments: []
                }));

                newState.projects = state.projects.map(p => 
                    p.id === targetProjectId 
                    ? { ...p, tasks: [...p.tasks, ...newTasks] }
                    : p
                );
            }
        }

        // Clear staging after commit
        return {
            ...newState,
            staging: { ...state.staging, records: [], activeImportId: null, isProcessing: false, summary: { total: 0, valid: 0, error: 0 } }
        };
    }

    case 'STAGING_CLEAR':
        return {
            ...state,
            staging: {
                activeImportId: null,
                entityType: 'Project',
                records: [],
                isProcessing: false,
                summary: { total: 0, valid: 0, error: 0 }
            }
        };

    default:
        return state;
  }
};
