import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.employee.findMany({ include: { user: true, department: true } });
  }

  get(id: string) {
    return this.prisma.employee.findUnique({ where: { id }, include: { user: true, department: true } });
  }

  async update(id: string, dto: Record<string, unknown>, actor: { id: string; role: string }) {
    const employee = await this.prisma.employee.findUnique({ where: { id }, include: { user: true } });
    if (!employee) throw new ForbiddenException();
    if (actor.role === 'EMPLOYEE' && employee.userId !== actor.id) {
      throw new ForbiddenException('Cannot edit other profile');
    }
    if (actor.role === 'EMPLOYEE') {
      const { phone, address, emergencyContact } = dto as any;
      return this.prisma.employee.update({ where: { id }, data: { phone, address, emergencyContact } });
    }
    return this.prisma.employee.update({ where: { id }, data: dto });
  }
}
