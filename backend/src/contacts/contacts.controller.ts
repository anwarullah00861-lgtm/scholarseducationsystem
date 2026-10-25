import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service';
import { CreateContactMessageDto, UpdateContactMessageDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PERMISSIONS } from '../auth/roles';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('contact')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactsService.create(createContactMessageDto);
  }

  @Get('admin/contacts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ permissions: [PERMISSIONS.CONTACT_READ] })
  findAll() {
    return this.contactsService.findAll();
  }

  @Patch('admin/contacts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ permissions: [PERMISSIONS.CONTACT_UPDATE] })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactMessageDto: UpdateContactMessageDto,
  ) {
    return this.contactsService.updateStatus(id, updateContactMessageDto);
  }
}
