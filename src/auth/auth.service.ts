import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token/token.service';
import { MailService } from 'src/mail/mail.service';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const activationCode = uuidv4();

    try {
      // create user
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          age: dto.age,
          email: dto.email,
          hash: hash,
          activationLink: activationCode,
        },
      });

      // send activation email
      await this.mailService
        .sendActivationMail(
          user.email,
          `${process.env.API_URL}/users/activate/${activationCode}`,
        )
        .catch((e) => {
          console.log(e);
        });

      // generate tokens
      const userDto = createAndSaveTokens(
        user,
        this.tokenService,
      );

      delete user.hash;
      return userDto;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credintial taken');
        }
        throw e;
      }
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          email: dto.email,
        },
      });
      const pwMatches = await argon.verify(
        user.hash,
        dto.password,
      );
      if (!pwMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }
      if (!user.isActivated) {
        throw new ForbiddenException('User not activated');
      }

      const userDto = createAndSaveTokens(
        user,
        this.tokenService,
      );

      delete user.hash;
      return userDto;
    } catch (e) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}

async function createAndSaveTokens(
  user: User,
  tokenService: TokenService,
) {
  const userDto = {
    userId: user.id,
    isActivated: user.isActivated,
    hash: user.hash,
    age: user.age,
    email: user.email,
    username: user.username,
  };

  const tokens = await tokenService.generateTokens({
    ...userDto,
  });

  await tokenService.saveRefreshToken(
    user.id,
    tokens.refreshToken,
  );

  return { tokens, ...userDto };
}
