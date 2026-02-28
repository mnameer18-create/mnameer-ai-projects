import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ApplyLeaveDto {
  @IsString() policyId!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsNumber() days!: number;
  @IsString() reason!: string;
}

export class ApproveLeaveDto {
  @IsString() status!: 'APPROVED' | 'REJECTED';
}
