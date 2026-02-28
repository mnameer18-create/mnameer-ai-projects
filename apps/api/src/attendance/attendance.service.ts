import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async clockIn(userId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    const now = new Date();
    return this.prisma.attendanceLog.upsert({
      where: { employeeId_date: { employeeId: employee!.id, date: new Date(now.toDateString()) } },
      update: { clockInAt: now },
      create: { employeeId: employee!.id, date: new Date(now.toDateString()), clockInAt: now },
    });
  }

  async clockOut(userId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    return this.prisma.attendanceLog.update({
      where: { employeeId_date: { employeeId: employee!.id, date: new Date(new Date().toDateString()) } },
      data: { clockOutAt: new Date() },
    });
  }

  async history(userId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    return this.prisma.attendanceLog.findMany({ where: { employeeId: employee!.id }, orderBy: { date: 'desc' }, take: 30 });
  }
}
