import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdmissionApplication,
  AdmissionStatus,
  Prisma,
} from '@prisma/client';
import { CreateAdmissionApplicationDto } from './dto/admission.dto';
import { UpdateAdmissionStatusDto } from './dto/admission.dto';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateAdmissionApplicationDto & {
      photoUrl: string;
      cnicCopyUrl?: string;
      domicileCopyUrl?: string;
      schoolLeavingCertUrl?: string;
    },
  ): Promise<AdmissionApplication> {
    return this.prisma.admissionApplication.create({
      data: {
        template: data.template,
        appliedClass: data.appliedClass,
        studentFullName: data.studentFullName,
        fatherFullName: data.fatherFullName,
        fatherCNIC: data.fatherCNIC,
        dateOfBirth: new Date(data.dateOfBirth),
        dateOfBirthInWords: data.dateOfBirthInWords,
        gender: data.gender,
        fatherOccupation: data.fatherOccupation,
        domicile: data.domicile,
        nationality: data.nationality,
        residentialAddress: data.residentialAddress,
        primaryContact: data.primaryContact,
        alternateContact: data.alternateContact ?? null,
        previousClass: data.previousClass ?? null,
        previousSchoolName: data.previousSchoolName ?? null,
        leavingDate: data.leavingDate ? new Date(data.leavingDate) : null,
        photoUrl: data.photoUrl,
        cnicCopyUrl: data.cnicCopyUrl ?? null,
        domicileCopyUrl: data.domicileCopyUrl ?? null,
        schoolLeavingCertUrl: data.schoolLeavingCertUrl ?? null,
      },
    });
  }

  async findAll(
    status?: AdmissionStatus,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: AdmissionApplication[]; total: number }> {
    const where: Prisma.AdmissionApplicationWhereInput = {};

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.admissionApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.admissionApplication.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<AdmissionApplication> {
    const application = await this.prisma.admissionApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Admission application with ID ${id} not found.`);
    }

    return application;
  }

  async updateStatus(
    id: string,
    dto: UpdateAdmissionStatusDto,
  ): Promise<AdmissionApplication> {
    const application = await this.prisma.admissionApplication.update({
      where: { id },
      data: { status: dto.status },
    });

    return application;
  }

  async checkDuplicate(
    fatherCNIC: string,
    studentFullName: string,
  ): Promise<AdmissionApplication | null> {
    return this.prisma.admissionApplication.findFirst({
      where: {
        fatherCNIC,
        studentFullName,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
