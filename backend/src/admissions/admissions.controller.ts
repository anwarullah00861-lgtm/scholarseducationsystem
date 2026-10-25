import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { AdmissionsService } from './admissions.service';
import {
  AdmissionStatus,
  CreateAdmissionApplicationDto,
  UpdateAdmissionStatusDto,
} from './dto/admission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PERMISSIONS } from '../auth/roles';

const UPLOAD_DIR = 'uploads/admissions';

// Ensure the upload directory exists so multer diskStorage can write to it.
mkdirSync(UPLOAD_DIR, { recursive: true });

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const maxFileSize = 5 * 1024 * 1024; // 5 MB

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Post('applications')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: maxFileSize, files: 4 },
      fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              `File type ${file.mimetype} is not allowed.`,
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body() dto: CreateAdmissionApplicationDto,
  ) {
    // Check for duplicate submission
    const existing = await this.admissionsService.checkDuplicate(
      dto.fatherCNIC,
      dto.studentFullName,
    );
    if (existing) {
      throw new BadRequestException(
        'An application with this CNIC and student name already exists.',
      );
    }

    const photoFile = files.find((f) => f.fieldname === 'photo');
    if (!photoFile) {
      throw new BadRequestException('Passport-size photo is required.');
    }

    const cnicCopyFile = files.find((f) => f.fieldname === 'cnicCopy');
    const domicileCopyFile = files.find((f) => f.fieldname === 'domicileCopy');
    const schoolLeavingCertFile = files.find(
      (f) => f.fieldname === 'schoolLeavingCert',
    );

    const applicationData = {
      ...dto,
      photoUrl: `/uploads/admissions/${photoFile.filename}`,
      cnicCopyUrl: cnicCopyFile
        ? `/uploads/admissions/${cnicCopyFile.filename}`
        : undefined,
      domicileCopyUrl: domicileCopyFile
        ? `/uploads/admissions/${domicileCopyFile.filename}`
        : undefined,
      schoolLeavingCertUrl: schoolLeavingCertFile
        ? `/uploads/admissions/${schoolLeavingCertFile.filename}`
        : undefined,
    };

    return this.admissionsService.create(applicationData);
  }

  @Get('admin/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ permissions: [PERMISSIONS.ADMISSIONS_READ] })
  findAll(@Query('status') status?: string) {
    return this.admissionsService.findAll(status as AdmissionStatus);
  }

  @Get('admin/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ permissions: [PERMISSIONS.ADMISSIONS_READ] })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.admissionsService.findOne(id);
  }

  @Patch('admin/applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles({ permissions: [PERMISSIONS.ADMISSIONS_MANAGE] })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdmissionStatusDto,
  ) {
    return this.admissionsService.updateStatus(id, dto);
  }
}
