import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  getProfiles() {
    return this.prisma.salaryProfile.findMany({ include: { employee: true } });
  }

  async updateSalary(id: string, data: any, actorId: string) {
    const profile = await this.prisma.salaryProfile.update({ where: { id }, data });
    await this.audit.log(actorId, 'SALARY_CHANGED', 'SalaryProfile', id);
    return profile;
  }

  generatePayslip(employeeId: string) {
    return { employeeId, generatedAt: new Date().toISOString(), status: 'stub-generated' };
  }
}
