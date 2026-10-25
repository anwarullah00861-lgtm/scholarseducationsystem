import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { PERMISSIONS } from './roles';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const reflector = new Reflector();

  const createContext = (handler: () => void, user?: unknown) => {
    const request: { user?: unknown } = { user };
    return {
      context: {
        switchToHttp: () => ({ getRequest: () => request }),
        getHandler: () => handler,
      } as unknown as ExecutionContext,
      request,
    };
  };

  beforeEach(() => {
    guard = new RolesGuard(reflector);
  });

  it('rejects an unauthenticated request', () => {
    const handler = () => undefined;
    const { context } = createContext(handler);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows staff to read contact messages', () => {
    const handler = () => undefined;
    Roles({ permissions: [PERMISSIONS.CONTACT_READ] })(handler);
    const { context } = createContext(handler, {
      id: 'user-1',
      role: 'STAFF',
      permissions: ['content:read', 'contact:read'],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('blocks staff from managing content', () => {
    const handler = () => undefined;
    Roles({
      roles: ['ADMIN', 'SUPER_ADMIN'],
      permissions: [PERMISSIONS.CONTENT_MANAGE],
    })(handler);
    const { context } = createContext(handler, {
      id: 'user-1',
      role: 'STAFF',
      permissions: ['content:read', 'contact:read'],
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('allows administrators to manage content', () => {
    const handler = () => undefined;
    Roles({
      roles: ['ADMIN', 'SUPER_ADMIN'],
      permissions: [PERMISSIONS.CONTENT_MANAGE],
    })(handler);
    const { context } = createContext(handler, {
      id: 'user-2',
      role: 'ADMIN',
      permissions: ['content:read', 'content:manage', 'contact:read', 'contact:update'],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('honours the wildcard permissions of a super administrator', () => {
    const handler = () => undefined;
    Roles({ permissions: [PERMISSIONS.CONTENT_MANAGE] })(handler);
    const { context } = createContext(handler, {
      id: 'user-9',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});
