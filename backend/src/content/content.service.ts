import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAnnouncementDto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        title: createAnnouncementDto.title,
        body: createAnnouncementDto.body,
        status: createAnnouncementDto.status ?? 'draft',
      },
    });
  }

  findAll(status?: string) {
    return this.prisma.announcement.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.announcement.findUnique({ where: { id } });
  }

  update(id: string, updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...(updateAnnouncementDto.title !== undefined ? { title: updateAnnouncementDto.title } : {}),
        ...(updateAnnouncementDto.body !== undefined ? { body: updateAnnouncementDto.body } : {}),
        ...(updateAnnouncementDto.status !== undefined ? { status: updateAnnouncementDto.status } : {}),
      },
    });
  }

  remove(id: string) {
    return this.prisma.announcement.delete({ where: { id } });
  }
}
