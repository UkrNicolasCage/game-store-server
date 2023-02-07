import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';

import { JwtGuard } from '../auth/token/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard) 
  @Get('me')
  getMe(@GetUser() user: User) {
    return "user";
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
  async activate(
    @Param('link') link,
    @Res({ passthrough: true }) res: any,
  ) {
    await this.userService.activate(link);

    res.redirect(process.env.CLIENT_URL);
  }
}
