
import { User, Role, Permission } from '../types/auth';

export const ROLE_DEFINITIONS: Record<Role, Permission[]> = {
  'Global Admin': [
    'app:access', 'admin:access', 
    'project:read', 'project:create', 'project:edit', 'project:delete', 'project:archive',
    'financials:read', 'financials:write', 'financials:approve',
    'resource:read', 'resource:write',
    'system:manage_users', 'system:configure'
  ],
  'Portfolio Manager': [
    'app:access', 
    'project:read', 'project:create', 'project:edit', 'project:archive',
    'financials:read', 'financials:write', 'financials:approve',
    'resource:read', 'resource:write'
  ],
  'Project Manager': [
    'app:access', 
    'project:read', 'project:edit',
    'financials:read', 'financials:write',
    'resource:read', 'resource:write'
  ],
  'Team Member': [
    'app:access', 
    'project:read', 'project:edit',
    'resource:read'
  ],
  'Viewer': [
    'app:access', 
    'project:read', 
    'financials:read', 
    'resource:read'
  ]
};

export const MOCK_USERS: User[] = [
  {
    id: 'U-001',
    name: 'Justin Saadein',
    email: 'justin@nexus.com',
    role: 'Global Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Justin',
    department: 'Executive',
    lastLogin: new Date().toISOString(),
    status: 'Active'
  },
  {
    id: 'U-002',
    name: 'Mike Ross',
    email: 'mike@nexus.com',
    role: 'Project Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    department: 'Engineering',
    lastLogin: '2024-06-10T09:00:00Z',
    status: 'Active'
  },
  {
    id: 'U-003',
    name: 'Jessica Pearson',
    email: 'jessica@nexus.com',
    role: 'Portfolio Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    department: 'Executive',
    lastLogin: '2024-06-12T14:30:00Z',
    status: 'Active'
  },
  {
    id: 'U-004',
    name: 'Louis Litt',
    email: 'louis@nexus.com',
    role: 'Team Member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis',
    department: 'Finance',
    lastLogin: '2024-06-11T11:20:00Z',
    status: 'Active'
  },
  {
    id: 'U-005',
    name: 'Guest Viewer',
    email: 'guest@nexus.com',
    role: 'Viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    department: 'External',
    lastLogin: '2024-06-01T10:00:00Z',
    status: 'Inactive'
  }
];
