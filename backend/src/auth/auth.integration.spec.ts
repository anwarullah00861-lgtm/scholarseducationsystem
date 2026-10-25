// Mock env validation so AppModule loads without requiring real env vars.
// The real validation happens in production via ConfigModule.forRoot({ validate: validateEnv }).
jest.mock('../config/env.validation', () => ({
  __esModule: true,
  validateEnv: (config: Record<string, unknown>) => config,
}));

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app/app.module';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { validateEnv } from '../config/env.validation';
import * as bcrypt from 'bcryptjs';

/**
 * Integration tests for the authentication flow.
 *
 * These tests run against a real PostgreSQL database and require a
 * `DATABASE_URL` environment variable. When no database is configured,
 * every test returns early (skipped) so the suite does not fail in
 * environments without Docker or a managed Postgres.
 */
describe('Auth integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  const testUser = {
    email: 'integration@example.com',
    password: 'IntegrationPass123',
    role: 'ADMIN' as const,
  };

  const hashPassword = async (password: string) =>
    bcrypt.hash(password, 4);

  let accessToken: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    process.env.NODE_ENV = 'development';
    process.env.JWT_SECRET =
      'test-secret-key-that-is-at-least-thirty-two-chars-long';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.REFRESH_TOKEN_EXPIRES_DAYS = '14';
    process.env.BCRYPT_SALT_ROUNDS = '4';
    process.env.CORS_ORIGIN = 'http://localhost:4200';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateEnv,
          cache: true,
        }),
        AppModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();
    await app.listen(0);

    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);

    await prisma.refreshToken.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.user.delete({ where: { email: testUser.email } });

    await prisma.user.create({
      data: {
        email: testUser.email,
        passwordHash: await hashPassword(testUser.password),
        role: testUser.role,
        status: 'active',
      },
    });
  });

  afterAll(async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    await prisma.refreshToken.deleteMany({
      where: { user: { email: testUser.email } },
    });
    await prisma.user.delete({ where: { email: testUser.email } });
    await prisma.$disconnect();
    await app.close();
  });

  const request = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const supertest = require('supertest');
    return supertest(app.getHttpServer());
  };

  it('POST /auth/login issues an access token and sets the refresh cookie', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request()
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.role).toBe(testUser.role);

    const setCookie = response.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const refreshCookie = Array.isArray(setCookie)
      ? setCookie.find((c) => c.startsWith('refreshToken='))
      : setCookie;
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie).toContain('HttpOnly');
    expect(refreshCookie).toContain('Path=/auth');

    refreshTokenCookie = refreshCookie!.split(';')[0].split('=')[1];
    accessToken = response.body.accessToken;
  });

  it('POST /auth/login rejects wrong credentials', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request()
      .post('/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword123' });

    expect(response.status).toBe(401);
  });

  it('GET /auth/me returns the authenticated user profile', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request()
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(testUser.email);
    expect(Array.isArray(response.body.permissions)).toBe(true);
  });

  it('GET /auth/me rejects a missing token', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request().get('/auth/me');
    expect(response.status).toBe(401);
  });

  it('POST /auth/refresh rotates the access token using the HttpOnly cookie', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request()
      .post('/auth/refresh')
      .set('Cookie', [`refreshToken=${refreshTokenCookie}`]);

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.accessToken).not.toBe(accessToken);

    accessToken = response.body.accessToken;

    const setCookie = response.headers['set-cookie'];
    const newCookie = Array.isArray(setCookie)
      ? setCookie.find((c) => c.startsWith('refreshToken='))
      : setCookie;
    expect(newCookie).toBeDefined();
    refreshTokenCookie = newCookie!.split(';')[0].split('=')[1];
  });

  it('POST /auth/refresh rejects a missing cookie', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request().post('/auth/refresh');
    expect(response.status).toBe(401);
  });

  it('POST /auth/logout revokes the refresh token and clears the cookie', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request()
      .post('/auth/logout')
      .set('Cookie', [`refreshToken=${refreshTokenCookie}`]);

    expect(response.status).toBe(200);
    expect(response.body.revoked).toBe(true);

    const retry = await request()
      .post('/auth/refresh')
      .set('Cookie', [`refreshToken=${refreshTokenCookie}`]);
    expect(retry.status).toBe(401);
  });
});
