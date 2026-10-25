export const ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = {
  CONTENT_READ: 'content:read',
  CONTENT_MANAGE: 'content:manage',
  CONTACT_READ: 'contact:read',
  CONTACT_UPDATE: 'contact:update',
  ADMISSIONS_READ: 'admissions:read',
  ADMISSIONS_MANAGE: 'admissions:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | '*';

export const ALL_PERMISSIONS: readonly Permission[] = ['*'];

export interface RoleRequirement {
  roles?: readonly Role[];
  permissions?: readonly Permission[];
}

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.CONTENT_MANAGE,
    PERMISSIONS.CONTACT_READ,
    PERMISSIONS.CONTACT_UPDATE,
    PERMISSIONS.ADMISSIONS_READ,
    PERMISSIONS.ADMISSIONS_MANAGE,
  ],
  STAFF: [PERMISSIONS.CONTENT_READ, PERMISSIONS.CONTACT_READ, PERMISSIONS.ADMISSIONS_READ],
};

export const hasPermission = (
  permissions: readonly string[],
  permission: Permission,
): boolean =>
  permissions.includes('*') || permissions.includes(permission);
