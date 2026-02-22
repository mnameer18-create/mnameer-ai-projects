import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles';
import { PayrollService } from './payroll.service';
import { CurrentUser } from '../common/current-user.decorator';

@ApiTags('payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private payroll: PayrollService) {}

  @Get('profiles')
  @Roles(AppRole.ADMIN, AppRole.HR)
  list() { return this.payroll.getProfiles(); }

  @Patch('profiles/:id')
  @Roles(AppRole.ADMIN, AppRole.HR)
  update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) { return this.payroll.updateSalary(id, data, user.id); }

  @Post('payslip/:employeeId')
  @Roles(AppRole.ADMIN, AppRole.HR)
  payslip(@Param('employeeId') employeeId: string) { return this.payroll.generatePayslip(employeeId); }
}
