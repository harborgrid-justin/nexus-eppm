import { DataState } from '../../types/index';
import { MOCK_PROJECT_2 } from '../mocks/project_data/main_projects';
import { MOCK_SCI_PROJECTS } from '../mocks/project_data/program_projects';
import { MOCK_RESOURCES } from '../mocks/resources';
import { 
    MOCK_BUDGET_ITEMS, MOCK_EXPENSES
} from '../mocks/finance';
import { MOCK_RISKS, MOCK_ISSUES } from '../mocks/risks';
import { MOCK_PROGRAMS } from '../mocks/programs';
import { MOCK_EPS, MOCK_OBS, MOCK_LOCATIONS } from '../mocks/structure';
import { MOCK_CALENDARS } from '../mocks/calendars';
import { MOCK_USERS } from '../auth';
import { initialState } from '../../context/initialState';
import { MOCK_ENTERPRISE_ROLES, MOCK_KANBAN_TASKS } from '../index';

export const softwareDemoData: Partial<DataState> = {
  ...initialState,
  projects: [MOCK_PROJECT_2, MOCK_SCI_PROJECTS[1]],
  programs: MOCK_PROGRAMS,
  resources: MOCK_RESOURCES,
  risks: [MOCK_RISKS[2]],
  issues: [MOCK_ISSUES[1]],
  budgetItems: [MOCK_BUDGET_ITEMS[3], MOCK_BUDGET_ITEMS[4]],
  expenses: [MOCK_EXPENSES[1]],
  
  // Use a different set for this demo
  kanbanTasks: MOCK_KANBAN_TASKS,

  // Enterprise Data
  eps: MOCK_EPS,
  obs: MOCK_OBS,
  locations: MOCK_LOCATIONS,
  calendars: MOCK_CALENDARS,
  users: MOCK_USERS,
  roles: MOCK_ENTERPRISE_ROLES,
};