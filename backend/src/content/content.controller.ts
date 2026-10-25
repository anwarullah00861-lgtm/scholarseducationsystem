import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PERMISSIONS } from '../auth/roles';

@Controller('admin/content/announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @Roles({ permissions: [PERMISSIONS.CONTENT_READ] })
  findAll(@Query('status') status?: string) {
    return this.contentService.findAll(status);
  }

  @Post()
  @Roles({ roles: ['ADMIN', 'SUPER_ADMIN'], permissions: [PERMISSIONS.CONTENT_MANAGE] })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.contentService.create(createAnnouncementDto);
  }

  @Patch(':id')
  @Roles({ roles: ['ADMIN', 'SUPER_ADMIN'], permissions: [PERMISSIONS.CONTENT_MANAGE] })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.contentService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @Roles({ roles: ['ADMIN', 'SUPER_ADMIN'], permissions: [PERMISSIONS.CONTENT_MANAGE] })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.remove(id);
  }
}
