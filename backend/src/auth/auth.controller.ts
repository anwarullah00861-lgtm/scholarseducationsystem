import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService, AuthResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { AuthRequestUser } from './interfaces/auth-request-user.interface';

interface AuthenticatedRequest extends Request {
  user?: AuthRequestUser;
}

interface AuthenticatedUserResponse {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: { id: string; email: string; role: string } }> {
    const result: AuthResponse = await this.authService.login(loginDto);

    this.setRefreshTokenCookie(response, result.refreshToken);

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('refresh')
  async refresh(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = request.cookies?.['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const tokens = await this.authService.refresh(refreshToken);
    this.setRefreshTokenCookie(response, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ revoked: boolean }> {
    const refreshToken = request.cookies?.['refreshToken'];
    let revoked = false;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
      revoked = true;
    }

    response.clearCookie('refreshToken', { path: '/auth' });

    return { revoked };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMe(@Req() request: AuthenticatedRequest): AuthenticatedUserResponse {
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated.');
    }

    return user;
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    const maxAgeSeconds = Number(this.config.get('REFRESH_TOKEN_EXPIRES_DAYS')) * 24 * 60 * 60;
    const isProduction = this.config.get('NODE_ENV') === 'production';

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      // Production serves the Angular app from Firebase Hosting and the API
      // from a separate origin, so the refresh cookie must be SameSite=None
      // to travel with credentialed cross-site requests.
      sameSite: isProduction ? 'none' : 'lax',
      path: '/auth',
      maxAge: maxAgeSeconds,
    });
  }
}
