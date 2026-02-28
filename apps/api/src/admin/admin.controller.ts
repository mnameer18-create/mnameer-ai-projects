import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/current-user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AppRole.ADMIN, AppRole.HR)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('departments')
  departments() { return this.admin.departments(); }

  @Post('departments')
  createDepartment(@Body('name') name: string) { return this.admin.createDepartment(name); }

  @Get('policies')
  policies() { return this.admin.policies(); }

  @Patch('roles')
  role(@Body() body: { userId: string; role: string }, @CurrentUser() user: any) {
    return this.admin.changeRole(body.userId, body.role, user.id);
  }
}
