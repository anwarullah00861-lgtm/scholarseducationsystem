import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequestUser } from './interfaces/auth-request-user.interface';
import { RoleRequirement, hasPermission } from './roles';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthRequestUser | undefined = request?.user;

    if (!user) {
      throw new ForbiddenException('Authentication is required.');
    }

    const requirement = this.reflector.get<RoleRequirement | undefined>(
      ROLES_KEY,
      context.getHandler(),
    );

    const requiredRoles = requirement?.roles;
    const requiredPermissions = requirement?.permissions;

    const rolesAllowed =
      !requiredRoles ||
      (requiredRoles as readonly string[]).includes(user.role);

    const permissionsAllowed =
      !requiredPermissions ||
      requiredPermissions.every((permission) =>
        hasPermission(user.permissions, permission),
      );

    if (!rolesAllowed || !permissionsAllowed) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }

    return true;
  }
}
