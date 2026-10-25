import { NotFoundException } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdmissionApplicationDto, UpdateAdmissionStatusDto } from './dto/admission.dto';
import { AdmissionClass, AdmissionGender, AdmissionTemplate } from './dto/admission.enum';

describe('AdmissionsService', () => {
  let service: AdmissionsService;

  const prisma = {
    admissionApplication: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((ops: Promise<unknown>[]) => Promise.all(ops));
    service = new AdmissionsService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('persists a new admission application with converted dates and file URLs', async () => {
      const created = { id: 'app-1', status: 'SUBMITTED' };
      prisma.admissionApplication.create.mockResolvedValue(created);

      const result = await service.create({
        template: AdmissionTemplate.NEW,
        appliedClass: AdmissionClass.GRADE_1,
        studentFullName: 'Ali Raza',
        fatherFullName: 'Ahmed Raza',
        fatherCNIC: '1234567890123',
        dateOfBirth: '2015-04-12',
        dateOfBirthInWords: 'Twelve April two thousand fifteen',
        gender: AdmissionGender.MALE,
        fatherOccupation: 'Teacher',
        domicile: 'Pakistan',
        nationality: 'Pakistani',
        residentialAddress: 'Mardan',
        primaryContact: '03001234567',
        alternateContact: undefined,
        previousClass: undefined,
        previousSchoolName: undefined,
        leavingDate: undefined,
        photoUrl: '/uploads/admissions/photo-1.jpg',
        cnicCopyUrl: '/uploads/admissions/cnic-1.jpg',
        domicileCopyUrl: undefined,
        schoolLeavingCertUrl: undefined,
      } as CreateAdmissionApplicationDto & {
        photoUrl: string;
        cnicCopyUrl?: string;
        domicileCopyUrl?: string;
        schoolLeavingCertUrl?: string;
      });

      expect(result).toEqual(created);
      expect(prisma.admissionApplication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          template: AdmissionTemplate.NEW,
          appliedClass: AdmissionClass.GRADE_1,
          studentFullName: 'Ali Raza',
          fatherCNIC: '1234567890123',
          dateOfBirth: new Date('2015-04-12'),
          dateOfBirthInWords: 'Twelve April two thousand fifteen',
          gender: AdmissionGender.MALE,
          fatherOccupation: 'Teacher',
          domicile: 'Pakistan',
          nationality: 'Pakistani',
          residentialAddress: 'Mardan',
          primaryContact: '03001234567',
          photoUrl: '/uploads/admissions/photo-1.jpg',
        }),
      });
    });
  });

  describe('findAll', () => {
    it('returns a paginated list of applications', async () => {
      const rows = [{ id: 'app-1' }, { id: 'app-2' }];
      prisma.admissionApplication.findMany.mockResolvedValue(rows);
      prisma.admissionApplication.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result).toEqual({ data: rows, total: 2 });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.admissionApplication.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(prisma.admissionApplication.count).toHaveBeenCalledWith({ where: {} });
    });

    it('filters by status when provided', async () => {
      prisma.admissionApplication.findMany.mockResolvedValue([]);
      prisma.admissionApplication.count.mockResolvedValue(0);

      await service.findAll('UNDER_REVIEW');

      expect(prisma.admissionApplication.findMany).toHaveBeenCalledWith({
        where: { status: 'UNDER_REVIEW' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });
  });

  describe('findOne', () => {
    it('returns a single application by id', async () => {
      const application = { id: 'app-1', status: 'SUBMITTED' };
      prisma.admissionApplication.findUnique.mockResolvedValue(application);

      await expect(service.findOne('app-1')).resolves.toEqual(application);
      expect(prisma.admissionApplication.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-1' },
      });
    });

    it('throws a not-found error when the application does not exist', async () => {
      prisma.admissionApplication.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates the status of an existing application', async () => {
      const updated = { id: 'app-1', status: 'ACCEPTED' };
      prisma.admissionApplication.update.mockResolvedValue(updated);

      const result = await service.updateStatus('app-1', { status: 'ACCEPTED' });

      expect(result).toEqual(updated);
      expect(prisma.admissionApplication.update).toHaveBeenCalledWith({
        where: { id: 'app-1' },
        data: { status: 'ACCEPTED' },
      });
    });
  });

  describe('checkDuplicate', () => {
    it('returns the existing application when a duplicate is found', async () => {
      const existing = { id: 'app-1', fatherCNIC: '1234567890123', studentFullName: 'Ali Raza' };
      prisma.admissionApplication.findFirst.mockResolvedValue(existing);

      await expect(
        service.checkDuplicate('1234567890123', 'Ali Raza'),
      ).resolves.toEqual(existing);

      expect(prisma.admissionApplication.findFirst).toHaveBeenCalledWith({
        where: {
          fatherCNIC: '1234567890123',
          studentFullName: 'Ali Raza',
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('returns null when no duplicate exists', async () => {
      prisma.admissionApplication.findFirst.mockResolvedValue(null);

      await expect(service.checkDuplicate('1234567890123', 'Ali Raza')).resolves.toBeNull();
    });
  });
});
