import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AnnouncementStatus } from '../announcement-status.constants';

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  body!: string;

  @IsOptional()
  @IsEnum(AnnouncementStatus)
  status?: AnnouncementStatus;
}
