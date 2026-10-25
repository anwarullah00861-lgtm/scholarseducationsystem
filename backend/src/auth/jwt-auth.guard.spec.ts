import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const jwt = { verifyAsync: jest.fn() };
  const prisma = { user: { findUnique: jest.fn() } };

  const createContext = (authorization?: string) => {
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: authorization ? { authorization } : {},
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    return { context, request };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new JwtAuthGuard(
      jwt as unknown as JwtService,
      prisma as unknown as PrismaService,
    );
  });

  it('rejects requests without a bearer token', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects an invalid or expired access token', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('expired'));
    const { context } = createContext('Bearer bad-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a token whose subject no longer exists', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1' });
    prisma.user.findUnique.mockResolvedValue(null);
    const { context } = createContext('Bearer good-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a suspended account even with a valid token', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'staff@scholars.edu',
      role: 'STAFF',
      status: 'suspended',
    });
    const { context } = createContext('Bearer good-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('attaches the user and role permissions when authentication succeeds', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@scholars.edu',
      role: 'ADMIN',
      status: 'active',
    });
    const { context, request } = createContext('Bearer good-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual({
      id: 'user-1',
      email: 'admin@scholars.edu',
      role: 'ADMIN',
      permissions: [
        'content:read',
        'content:manage',
        'contact:read',
        'contact:update',
        'admissions:read',
        'admissions:manage',
      ],
    });
  });

  it('grants super administrators every permission', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-9' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-9',
      email: 'root@scholars.edu',
      role: 'SUPER_ADMIN',
      status: 'active',
    });
    const { context, request } = createContext('Bearer good-token');

    await guard.canActivate(context);

    expect((request.user as { permissions: string[] }).permissions).toEqual(['*']);
  });
});
