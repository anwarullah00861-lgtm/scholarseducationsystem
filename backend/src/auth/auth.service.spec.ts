import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const prisma = {
    user: { findUnique: jest.fn() },
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const jwt = { signAsync: jest.fn() };
  const config = { get: jest.fn() };

  const activeUser = {
    id: 'user-1',
    email: 'admin@scholars.edu',
    passwordHash: bcrypt.hashSync('correct-password', 4),
    role: 'ADMIN',
    status: 'active',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    config.get.mockImplementation((key: string) => {
      const values: Record<string, string> = {
        BCRYPT_SALT_ROUNDS: '4',
        REFRESH_TOKEN_EXPIRES_DAYS: '14',
        JWT_EXPIRES_IN: '15m',
        NODE_ENV: 'test',
      };
      return values[key];
    });
    jwt.signAsync.mockResolvedValue('signed-access-token');
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
      config as unknown as ConfigService,
    );
  });

  describe('login', () => {
    it('issues an access token and creates a hashed refresh token', async () => {
      prisma.user.findUnique.mockResolvedValue(activeUser);
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({
        email: 'Admin@Scholars.EDU',
        password: 'correct-password',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@scholars.edu' },
      });
      expect(result.user.role).toBe('ADMIN');
      expect(result.accessToken).toBe('signed-access-token');
      expect(result.refreshToken).toHaveLength(96);
      expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
      expect(prisma.refreshToken.create.mock.calls[0][0].data.userId).toBe('user-1');
    });

    it('rejects an unknown email with the same error message', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@scholars.edu', password: 'whatever-123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      prisma.user.findUnique.mockResolvedValue(activeUser);

      await expect(
        service.login({ email: 'admin@scholars.edu', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a suspended account', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...activeUser, status: 'suspended' });

      await expect(
        service.login({ email: 'admin@scholars.edu', password: 'correct-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('rotates the token: issues new tokens and revokes the old one', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue({
        userId: 'user-1',
        revoked: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: activeUser,
      });
      prisma.refreshToken.create.mockResolvedValue({});
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      const tokens = await service.refresh('raw-refresh-token');

      expect(tokens.refreshToken).toHaveLength(96);
      expect(tokens.refreshToken).not.toBe('raw-refresh-token');
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.refreshToken.updateMany.mock.calls[0][0].data).toEqual({ revoked: true });
    });

    it('rejects an unknown refresh token', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue(null);

      await expect(service.refresh('not-a-token')).rejects.toThrow(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });

    it('rejects an expired refresh token', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue({
        userId: 'user-1',
        revoked: false,
        expiresAt: new Date(Date.now() - 1000),
        user: activeUser,
      });

      await expect(service.refresh('expired-token')).rejects.toThrow(UnauthorizedException);
      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
    });

    it('rejects a token whose account is suspended', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue({
        userId: 'user-1',
        revoked: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: { ...activeUser, status: 'suspended' },
      });

      await expect(service.refresh('raw-refresh-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('revokes the presented refresh token', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue({
        userId: 'user-1',
        revoked: false,
        expiresAt: new Date(Date.now() + 60_000),
        user: activeUser,
      });
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await service.logout('raw-refresh-token');

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.refreshToken.updateMany.mock.calls[0][0].data).toEqual({ revoked: true });
    });

    it('does nothing for an unknown token', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue(null);

      await service.logout('unknown');

      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    });
  });
});
