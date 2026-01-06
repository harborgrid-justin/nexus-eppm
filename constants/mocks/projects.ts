
import { Project } from '../../types/index';
import { MOCK_PROJECT_1, MOCK_PROJECT_2, MOCK_PROJECT_3 } from './project_data/main_projects';
import { MOCK_SCI_PROJECTS } from './project_data/program_projects';
import { 
    MOCK_STAKEHOLDERS, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_COMM_LOGS, 
    MOCK_QUALITY_REPORTS, MOCK_DEFECTS 
} from './project_data/meta_artifacts';

// This file aggregates all mock project data from the distributed files.

export { MOCK_STAKEHOLDERS, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_COMM_LOGS, MOCK_QUALITY_REPORTS, MOCK_DEFECTS };
export { MOCK_PROJECT_1, MOCK_PROJECT_2, MOCK_PROJECT_3, MOCK_SCI_PROJECTS };

export const MOCK_PROJECTS: Project[] = [
  MOCK_PROJECT_1,
  MOCK_PROJECT_2,
  MOCK_PROJECT_3,
  ...MOCK_SCI_PROJECTS,
];
