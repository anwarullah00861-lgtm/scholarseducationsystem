import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAdmissionApplicationDto, UpdateAdmissionStatusDto } from './admission.dto';

describe('CreateAdmissionApplicationDto', () => {
  const validPayload = {
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
    alternateContact: '03009876543',
    previousClass: 'GRADE_4',
    previousSchoolName: 'Other School',
    leavingDate: '2025-06-30',
    photoUrl: '/uploads/admissions/photo-1.jpg',
  };

  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateAdmissionApplicationDto, validPayload);

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects an invalid template, class, gender and short fields', async () => {
    const dto = plainToInstance(CreateAdmissionApplicationDto, {
      ...validPayload,
      template: 'INVALID_TEMPLATE',
      appliedClass: 'GRADE_9',
      gender: 'MALE_MALE',
      studentFullName: 'A',
      fatherCNIC: '123',
    });

    const errors = await validate(dto);
    const properties = errors.flatMap((error) => error.property);

    expect(properties).toEqual(
      expect.arrayContaining(['template', 'appliedClass', 'gender', 'studentFullName', 'fatherCNIC']),
    );
  });

  it('rejects a payload with missing required fields', async () => {
    const dto = plainToInstance(CreateAdmissionApplicationDto, {
      template: 'NEW',
      appliedClass: 'GRADE_1',
      dateOfBirth: '2015-04-12',
      dateOfBirthInWords: 'Twelve April two thousand fifteen',
      gender: 'MALE',
      fatherOccupation: 'Teacher',
      domicile: 'Pakistan',
      nationality: 'Pakistani',
      residentialAddress: 'Mardan',
      primaryContact: '03001234567',
      photoUrl: '/uploads/admissions/photo-1.jpg',
    });

    const errors = await validate(dto);
    const properties = errors.flatMap((error) => error.property);

    expect(properties).toEqual(expect.arrayContaining(['studentFullName', 'fatherFullName', 'fatherCNIC']));
  });
});

describe('UpdateAdmissionStatusDto', () => {
  it('accepts a known admission status', async () => {
    const dto = plainToInstance(UpdateAdmissionStatusDto, { status: 'SUBMITTED' });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects an unknown admission status', async () => {
    const dto = plainToInstance(UpdateAdmissionStatusDto, { status: 'MAYBE' });

    const errors = await validate(dto);
    expect(errors.map((error) => error.property)).toContain('status');
  });
});
