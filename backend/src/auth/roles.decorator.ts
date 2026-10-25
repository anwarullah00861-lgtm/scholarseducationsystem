import { SetMetadata } from '@nestjs/common';
import { RoleRequirement } from './roles';

export const ROLES_KEY = 'authorization:roles';

export const Roles = (requirement: RoleRequirement) =>
  SetMetadata(ROLES_KEY, requirement);
