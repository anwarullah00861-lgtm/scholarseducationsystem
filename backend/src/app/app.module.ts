import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { NextFunction, Request, Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './app-config.module';
import { parseCookies } from '../common/utils/parse-cookies';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ContentModule } from '../content/content.module';
import { ContactsModule } from '../contacts/contacts.module';
import { AdmissionsModule } from '../admissions/admissions.module';

function cookieMiddleware(req: Request, _res: Response, next: NextFunction): void {
  (req as Request & { cookies: Record<string, string> }).cookies = parseCookies(
    req.headers.cookie,
  );
  next();
}

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    PrismaModule,
    AuthModule,
    ContentModule,
    ContactsModule,
    AdmissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [PrismaModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieMiddleware).forRoutes('*');
  }
}
