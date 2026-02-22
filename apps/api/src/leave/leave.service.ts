import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async apply(userId: string, dto: any) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    if (!employee) throw new ForbiddenException();
    return this.prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        policyId: dto.policyId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        days: dto.days,
        reason: dto.reason,
      },
    });
  }

  queue() {
    return this.prisma.leaveRequest.findMany({ where: { status: 'PENDING' }, include: { employee: true, policy: true } });
  }

  balances(userId: string) {
    return this.prisma.employee.findUnique({ where: { userId }, include: { leaveBalances: { include: { policy: true } } } });
  }

  async approve(id: string, approver: { id: string }, status: 'APPROVED' | 'REJECTED') {
    const req = await this.prisma.leaveRequest.update({ where: { id }, data: { status, approverId: approver.id } });
    if (status === 'APPROVED') {
      await this.prisma.leaveBalance.updateMany({
        where: { employeeId: req.employeeId, policyId: req.policyId, year: new Date().getFullYear() },
        data: { remainingDays: { decrement: req.days } },
      });
      await this.audit.log(approver.id, 'LEAVE_APPROVED', 'LeaveRequest', req.id, { status });
    }
    return req;
  }
}
