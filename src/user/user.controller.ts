import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';

import { JwtGuard } from '../auth/token/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @UseGuards(JwtGuard)
  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Get('activate/:link')
  async activate(@Param('link') link) {
    // console.log(param);
    await this.userService.activate(link);
    return 'ok';
  }
  @UseGuards(JwtGuard)
  @Get('refresh')
  refresh() {
    return 'refresh';
  }
}
