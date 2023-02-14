import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token/token.service';
import { MailService } from 'src/mail/mail.service';
import { User } from '@prisma/client';
import { ApiExeption } from 'src/user/exeptions/ApiError.exception';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    console.log(dto);
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

      const userDto = createUserDto(user);
      return this.tokenService.createAndSaveTokens(userDto);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credintial taken');
        }
        throw e;
      }
    }
  }

  async signin(dto: SigninDto) {
   
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
      console.log("fdfdf")
      const userDto = createUserDto(user);
      return this.tokenService.createAndSaveTokens(userDto);
    } catch (e) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
  logout(refreshToken: string) {
    return this.tokenService.removeRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiExeption.UnauthorizedError();
    }

    try {
      const tokenData = await this.tokenService.findRefreshToken(
        refreshToken,
      );

      const userData = await this.prisma.user.findFirst({
        where: {
          id: tokenData.userId,
        },
      });

      const userDto = createUserDto(userData);
      return this.tokenService.createAndSaveTokens(userDto);
    } catch (e) {
      throw ApiExeption.UnauthorizedError();
    }
  }
}

function createUserDto(user: User) {
  return {
    userId: user.id,
    isActivated: user.isActivated,
    hash: user.hash,
    age: user.age,
    email: user.email,
    username: user.username,
  };
}
