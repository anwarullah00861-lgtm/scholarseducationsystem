import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequestUser } from './interfaces/auth-request-user.interface';
import { ROLE_PERMISSIONS } from './roles';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization: string | undefined = request?.headers?.authorization;

    const [scheme, token] = (authorization ?? '').split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    let payload: { sub?: string; email?: string; role?: string };

    try {
      payload = await this.jwtService.verifyAsync<{ sub?: string; email?: string; role?: string }>(
        token,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Account is not active.');
    }

    const permissions =
      user.role === 'SUPER_ADMIN'
        ? ['*']
        : [...(ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] ?? [])];

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions,
    } satisfies AuthRequestUser;

    return true;
  }
}
