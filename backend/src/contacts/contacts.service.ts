import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto, UpdateContactMessageDto } from './dto/contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createContactMessageDto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: createContactMessageDto.name,
        email: createContactMessageDto.email,
        subject: createContactMessageDto.subject,
        message: createContactMessageDto.message,
        status: 'new',
      },
    });
  }

  findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.contactMessage.findUnique({ where: { id } });
  }

  updateStatus(id: string, updateContactMessageDto: UpdateContactMessageDto) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status: updateContactMessageDto.status },
    });
  }
}
