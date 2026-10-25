import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AdminContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
