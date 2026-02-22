import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() emergencyContact?: string;
}
