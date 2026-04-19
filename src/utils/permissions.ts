import type { TabName } from '../components/admin/Sidebar';

export type UserRole = 'ADMIN' | 'DIRECTOR' | 'DOCENTE';

interface PermissionConfig {
  accessibleTabs: TabName[];
}

const PERMISSIONS: Record<UserRole, PermissionConfig> = {
  ADMIN: {
    accessibleTabs: [
      'dashboard',
      'registration',
      'students',
      'daily_attendance',
      'occupancy',
      'tasks',
      'announcements',
      'reports',
      'justifications',
      'telegram',
      'settings',
      'academic',
      'grades',
      'audit',
    ],
  },
  DIRECTOR: {
    accessibleTabs: [
      'dashboard',
      'registration',
      'students',
      'daily_attendance',
      'occupancy',
      'tasks',
      'announcements',
      'reports',
      'justifications',
      'telegram',
      'settings',
      'academic',
      'grades',
      'audit',
    ],
  },
  DOCENTE: {
    accessibleTabs: [
      'dashboard',
      'students',
      'daily_attendance',
      'occupancy',
      'tasks',
      'announcements',
      'justifications',
    ],
  },
};

export interface ModulePermission {
  id?: number;
  role: string;
  module_name: string;
  is_enabled: boolean;
}

export const canAccessTab = (
  role: string | null, 
  tab: TabName, 
  isSuperuser: boolean, 
  dynamicPermissions: ModulePermission[] = []
): boolean => {
  if (isSuperuser) return true;
  if (!role) return false;
  
  // Si tenemos permisos dinámicos, usarlos
  if (dynamicPermissions && dynamicPermissions.length > 0) {
    const permission = dynamicPermissions.find(
      p => p.role.toUpperCase() === role.toUpperCase() && p.module_name === tab
    );
    return permission ? permission.is_enabled : false;
  }

  // Fallback a mapa estático por seguridad (mientras cargan los permisos)
  const userRole = role.toUpperCase() as UserRole;
  const config = PERMISSIONS[userRole];
  
  if (!config) return false;
  
  return config.accessibleTabs.includes(tab);
};

export const isAdminRole = (role: string | null, isSuperuser: boolean): boolean => {
  return isSuperuser || role === 'ADMIN' || role === 'DIRECTOR';
};
