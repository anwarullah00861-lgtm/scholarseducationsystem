import { IsEmail, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const CONTACT_STATUSES = ['new', 'responded', 'archived'] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export class CreateContactMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsEmail()
  @IsString()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  subject!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  message!: string;
}

export class UpdateContactMessageDto {
  @IsIn(CONTACT_STATUSES)
  status!: ContactStatus;
}
