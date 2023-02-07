import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async generateTokens(payload) {
    const accessSecret = this.config.get('JWT_SECRET');
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: accessSecret,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: refreshSecret,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const tokenData = await this.prisma.token.findFirst({
      where: {
        userId,
      },
    });

    if (tokenData) {
      return this.prisma.token.update({
        where: {
          id: tokenData.id,
        },
        data: {
          refreshToken,
        },
      });
    }
    return this.prisma.token.create({
      data: {
        userId,
        refreshToken,
      },
    });
  }
  async removeRefreshToken(refreshToken: string) {
    return this.prisma.token.delete({
      where: {
        refreshToken,
      },
    });
  }

  async findRefreshToken(refreshToken: string) {
    return this.prisma.token.findFirst({
      where: {
        refreshToken,
      },
    });
  }
}
