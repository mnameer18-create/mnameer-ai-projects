import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { LeaveService } from './leave.service';
import { CurrentUser } from '../common/current-user.decorator';
import { ApplyLeaveDto, ApproveLeaveDto } from './dto';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles';

@ApiTags('leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeaveController {
  constructor(private leave: LeaveService) {}

  @Post('apply')
  apply(@CurrentUser() user: any, @Body() dto: ApplyLeaveDto) { return this.leave.apply(user.id, dto); }

  @Get('queue')
  @Roles(AppRole.ADMIN, AppRole.HR, AppRole.MANAGER)
  queue() { return this.leave.queue(); }

  @Get('balances')
  balances(@CurrentUser() user: any) { return this.leave.balances(user.id); }

  @Patch(':id/decision')
  @Roles(AppRole.ADMIN, AppRole.HR, AppRole.MANAGER)
  approve(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: ApproveLeaveDto) {
    return this.leave.approve(id, user, dto.status);
  }
}
