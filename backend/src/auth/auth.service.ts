import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserPayload;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: string;
}

interface TokenUser {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const email = loginDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const userPayload: AuthUserPayload = { id: user.id, email: user.email, role: user.role };

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userPayload };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenUser = await this.findUserForToken(refreshToken);

    if (!tokenUser) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const tokens = await this.issueTokens(tokenUser);

    await this.revokeToken(refreshToken, tokenUser.id);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenUser = await this.findUserForToken(refreshToken);

    if (tokenUser) {
      await this.revokeToken(refreshToken, tokenUser.id);
    }
  }

  private async findUserForToken(refreshToken: string): Promise<TokenUser | null> {
    const tokenHash = this.hashToken(refreshToken);

    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, revoked: false },
      include: { user: true },
    });

    if (!tokenRecord || !tokenRecord.user) {
      return null;
    }

    const user = tokenRecord.user;

    if (user.status !== 'active') {
      return null;
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return { id: user.id, email: user.email, role: user.role };
  }

  private async revokeToken(refreshToken: string, userId: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash, revoked: false },
      data: { revoked: true },
    });
  }

  private hashToken(refreshToken: string): string {
    // Refresh tokens are 48 cryptographically random bytes, so a keyed lookup
    // hash is safe here and allows exact-match queries (bcrypt salts each hash,
    // which would make lookups impossible).
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private async issueTokens(user: TokenUser): Promise<AuthTokens> {
    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenExpiresDays = Number(this.config.get('REFRESH_TOKEN_EXPIRES_DAYS'));
    const tokenHash = this.hashToken(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + refreshTokenExpiresDays * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: this.config.get('JWT_EXPIRES_IN') },
    );

    return { accessToken, refreshToken };
  }
}
