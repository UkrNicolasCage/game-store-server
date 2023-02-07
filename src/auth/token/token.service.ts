import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiExeption } from 'src/user/exeptions/ApiError.exception';

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
    try {
      return this.prisma.token.delete({
        where: {
          refreshToken,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findRefreshToken(refreshToken: string) {
    try {
      return this.prisma.token.findFirst({
        where: {
          refreshToken,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async validatAcceseToken(accessToken: string) {
    console.log(accessToken);
    try {
      const user = await this.jwt.verifyAsync(accessToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      return user;
    } catch (e) {
      throw ApiExeption.UnauthorizedError();
    }

    return null;
  }

  async validateRefreshToken(token: string) {
    try {
      const user = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      return user;
    } catch (e) {
      throw ApiExeption.UnauthorizedError();
    }
  }

  findTokenByRefreshToken(refreshToken: string) {
    return this.prisma.token.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  async createAndSaveTokens(userDto: any) {
    const tokens = await this.generateTokens({
      ...userDto,
    });
    await this.saveRefreshToken(
      userDto.userId,
      tokens.refreshToken,
    );
    delete userDto.hash;
    return { tokens, ...userDto };
  }
}
