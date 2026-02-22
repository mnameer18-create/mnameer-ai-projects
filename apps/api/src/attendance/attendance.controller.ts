import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AttendanceService } from './attendance.service';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendance: AttendanceService) {}

  @Post('clock-in')
  in(@CurrentUser() user: any) { return this.attendance.clockIn(user.id); }

  @Post('clock-out')
  out(@CurrentUser() user: any) { return this.attendance.clockOut(user.id); }

  @Get('history')
  history(@CurrentUser() user: any) { return this.attendance.history(user.id); }
}
