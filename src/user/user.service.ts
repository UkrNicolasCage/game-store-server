import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { ApiExeption } from './exeptions/ApiError.exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }

  async activate(link: string) {
    console.log(link);
    const user = await this.prisma.user.findFirst({
      where: { activationLink: link },
    });
    if (!user) {
      throw ApiExeption.UnauthorizedError();
    }
    user.isActivated = true;
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }
}
