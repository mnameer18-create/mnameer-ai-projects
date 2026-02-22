import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const deptEng = await prisma.department.upsert({ where: { name: 'Engineering' }, update: {}, create: { name: 'Engineering' } });
  const deptHR = await prisma.department.upsert({ where: { name: 'People Ops' }, update: {}, create: { name: 'People Ops' } });

  const policy = await prisma.leavePolicy.create({
    data: { name: 'Annual Leave', annualDays: 14, carryForwardDays: 5 },
  }).catch(async () => prisma.leavePolicy.findFirstOrThrow({ where: { name: 'Annual Leave' } }));

  const makeUser = async (email: string, role: Role, fullName: string, departmentId: string) => {
    const passwordHash = await argon2.hash('Password123!');
    const user = await prisma.user.upsert({
      where: { email },
      update: { role },
      create: { email, role, passwordHash },
    });
    const employee = await prisma.employee.upsert({
      where: { userId: user.id },
      update: { fullName, departmentId },
      create: { userId: user.id, fullName, departmentId, title: role },
    });
    await prisma.leaveBalance.upsert({
      where: { employeeId_policyId_year: { employeeId: employee.id, policyId: policy.id, year: new Date().getFullYear() } },
      update: {},
      create: { employeeId: employee.id, policyId: policy.id, year: new Date().getFullYear(), remainingDays: 14 },
    });
  };

  await makeUser('admin@startup.local', Role.ADMIN, 'Admin User', deptHR.id);
  await makeUser('hr@startup.local', Role.HR, 'HR User', deptHR.id);
  await makeUser('manager@startup.local', Role.MANAGER, 'Manager User', deptEng.id);
  await makeUser('employee1@startup.local', Role.EMPLOYEE, 'Employee One', deptEng.id);
  await makeUser('employee2@startup.local', Role.EMPLOYEE, 'Employee Two', deptEng.id);
}

main().finally(() => prisma.$disconnect());
