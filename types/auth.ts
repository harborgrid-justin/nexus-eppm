
export type Role = 'Global Admin' | 'Portfolio Manager' | 'Project Manager' | 'Team Member' | 'Viewer';

export type Permission = 
  // Core
  | 'app:access'
  | 'admin:access'
  // Projects
  | 'project:read'
  | 'project:create'
  | 'project:edit'
  | 'project:delete'
  | 'project:archive'
  // Financials
  | 'financials:read'
  | 'financials:write'
  | 'financials:approve'
  // Resources
  | 'resource:read'
  | 'resource:write'
  // System
  | 'system:manage_users'
  | 'system:configure';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Locked';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  mfaEnforced: boolean;
  sessionTimeoutMinutes: number;
  allowGuestAccess: boolean;
  supportEmail: string;
}
