import { ForbiddenException, Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async upload(user: any, employeeId: string, type: string, filePath: string) {
    if (user.role === 'EMPLOYEE') {
      const self = await this.prisma.employee.findUnique({ where: { userId: user.id } });
      if (self?.id !== employeeId) throw new ForbiddenException();
    }
    const doc = await this.prisma.document.create({ data: { employeeId, type, filePath, uploadedBy: user.id } });
    await this.audit.log(user.id, 'DOCUMENT_UPLOADED', 'Document', doc.id);
    return doc;
  }

  list(employeeId: string) {
    return this.prisma.document.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' } });
  }

  async stream(id: string, user: any) {
    const doc = await this.prisma.document.findUnique({ where: { id }, include: { employee: true } });
    if (!doc) throw new ForbiddenException();
    if (user.role === 'EMPLOYEE' && doc.employee.userId !== user.id) throw new ForbiddenException();
    await this.audit.log(user.id, 'DOCUMENT_DOWNLOADED', 'Document', id);
    return { doc, stream: createReadStream(doc.filePath) };
  }
}
