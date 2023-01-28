import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'Credintial taken',
          );
        }
        throw e;
      }
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user =
        await this.prisma.user.findFirstOrThrow({
          where: {
            email: dto.email,
          },
        });
      const pwMatches = await argon.verify(
        user.hash,
        dto.password,
      );

      if (!pwMatches) {
        throw new ForbiddenException(
          'Credentials incorrect',
        );
      }

      return await this.signToken(user.id, user.email);
    } catch (e) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

   

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '300m',
      secret,
    });
    return {
      acces_token: token,
    };
  }
}
