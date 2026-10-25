import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AdmissionClass, AdmissionGender, AdmissionTemplate } from './admission.enum';

export const ADMISSION_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'WAITLISTED',
] as const;

export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export class CreateAdmissionApplicationDto {
  @IsEnum(AdmissionTemplate)
  template!: AdmissionTemplate;

  @IsEnum(AdmissionClass)
  appliedClass!: AdmissionClass;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  studentFullName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fatherFullName!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  fatherCNIC!: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  dateOfBirthInWords!: string;

  @IsEnum(AdmissionGender)
  gender!: AdmissionGender;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fatherOccupation!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  domicile!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nationality!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  residentialAddress!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  primaryContact!: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  alternateContact?: string;

  @IsOptional()
  @IsString()
  previousClass?: string;

  @IsOptional()
  @IsString()
  previousSchoolName?: string;

  @IsOptional()
  @IsString()
  leavingDate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  cnicCopyUrl?: string;

  @IsOptional()
  @IsString()
  domicileCopyUrl?: string;

  @IsOptional()
  @IsString()
  schoolLeavingCertUrl?: string;
}

export class UpdateAdmissionStatusDto {
  @IsEnum(ADMISSION_STATUSES as any)
  status!: AdmissionStatus;
}
