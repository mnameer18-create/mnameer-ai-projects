import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  departments() { return this.prisma.department.findMany(); }
  createDepartment(name: string) { return this.prisma.department.create({ data: { name } }); }

  async changeRole(userId: string, role: any, actorId: string) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { role } });
    await this.audit.log(actorId, 'ROLE_CHANGED', 'User', userId, { role });
    return user;
  }

  policies() { return this.prisma.leavePolicy.findMany(); }
}
