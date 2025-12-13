
import { useAuth } from '../context/AuthContext';
import { Permission, Role } from '../types/auth';
import { ROLE_DEFINITIONS } from '../constants/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_DEFINITIONS[user.role] || [];
    return permissions.includes(permission);
  };

  const hasRole = (role: Role | Role[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const canEditProject = () => hasPermission('project:edit');
  const canManageSystem = () => hasPermission('system:configure');
  const canApproveBudget = () => hasPermission('financials:approve');

  return {
    user,
    hasPermission,
    hasRole,
    canEditProject,
    canManageSystem,
    canApproveBudget
  };
};
