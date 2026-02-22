import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync(payload, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET });
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    await this.audit.log(user.id, 'LOGIN', 'User', user.id);
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refresh(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshTokenHash || !(await argon2.verify(user.refreshTokenHash, token))) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: await this.jwt.signAsync(payload, { expiresIn: '15m' }) };
  }
}
