import { BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdmissionsController } from './admissions.controller';
import { AdmissionsService } from './admissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateAdmissionApplicationDto } from './dto/admission.dto';
import { AdmissionTemplate } from './dto/admission.enum';

describe('AdmissionsController', () => {
  let controller: AdmissionsController;
  let service: {
    create: jest.Mock;
    checkDuplicate: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    updateStatus: jest.Mock;
  };

  const dto = {
    template: 'NEW',
    appliedClass: 'GRADE_1',
    studentFullName: 'Ali Raza',
    fatherFullName: 'Ahmed Raza',
    fatherCNIC: '1234567890123',
    dateOfBirth: '2015-04-12',
    dateOfBirthInWords: 'Twelve April two thousand fifteen',
    gender: 'MALE',
    fatherOccupation: 'Teacher',
    domicile: 'Pakistan',
    nationality: 'Pakistani',
    residentialAddress: 'Mardan',
    primaryContact: '03001234567',
    photoUrl: '/uploads/admissions/photo-1.jpg',
  } as unknown as CreateAdmissionApplicationDto;

  beforeEach(() => {
    jest.clearAllMocks();
    service = {
      create: jest.fn(),
      checkDuplicate: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
    };
    controller = new AdmissionsController(service as unknown as AdmissionsService);
  });

  describe('POST /admissions/applications', () => {
    it('requires a passport-size photo before submitting', async () => {
      await expect(controller.create([], dto)).rejects.toThrow(BadRequestException);
      expect(service.create).not.toHaveBeenCalled();
    });

    it('rejects duplicate submissions', async () => {
      service.checkDuplicate.mockResolvedValue({ id: 'app-1' });

      await expect(controller.create([], dto)).rejects.toThrow(BadRequestException);
      expect(service.create).not.toHaveBeenCalled();
    });

    it('creates an application and stores the uploaded file URLs', async () => {
      service.checkDuplicate.mockResolvedValue(null);
      service.create.mockResolvedValue({ id: 'app-1' });

      const files = [
        { fieldname: 'photo', filename: 'photo-1.jpg' },
        { fieldname: 'cnicCopy', filename: 'cnic-1.jpg' },
        { fieldname: 'domicileCopy', filename: 'domicile-1.jpg' },
        { fieldname: 'schoolLeavingCert', filename: 'slc-1.jpg' },
      ] as unknown as Express.Multer.File[];

      const result = await controller.create(files, dto);

      expect(result).toEqual({ id: 'app-1' });
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          photoUrl: '/uploads/admissions/photo-1.jpg',
          cnicCopyUrl: '/uploads/admissions/cnic-1.jpg',
          domicileCopyUrl: '/uploads/admissions/domicile-1.jpg',
          schoolLeavingCertUrl: '/uploads/admissions/slc-1.jpg',
        }),
      );
    });
  });

  describe('GET /admissions/admin/applications', () => {
    it('delegates the optional status filter to the service', async () => {
      service.findAll.mockResolvedValue({ data: [], total: 0 });

      const result = await controller.findAll('SUBMITTED');

      expect(result).toEqual({ data: [], total: 0 });
      expect(service.findAll).toHaveBeenCalledWith('SUBMITTED');
    });
  });

  describe('PATCH /admissions/admin/applications/:id/status', () => {
    it('updates the application status through the service', async () => {
      const updated = { id: 'app-1', status: 'ACCEPTED' };
      service.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateStatus('app-1', { status: 'ACCEPTED' });

      expect(result).toEqual(updated);
      expect(service.updateStatus).toHaveBeenCalledWith('app-1', { status: 'ACCEPTED' });
    });
  });

  describe('admin route protection', () => {
    const reflector = new Reflector();

    it('protects the admin listing route with auth and role guards', () => {
      const guards = reflector.get('__guards__', AdmissionsController.prototype.findAll);

      expect(guards).toBeDefined();
      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    });
  });
});
