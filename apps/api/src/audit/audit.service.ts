import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(actorUserId: string | null, action: string, entityType: string, entityId?: string, metadata?: object) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: actorUserId ?? undefined,
        action,
        entityType,
        entityId,
        metadataJson: metadata,
      },
    });
  }
}
