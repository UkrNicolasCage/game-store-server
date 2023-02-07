import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res,
  ) {
    const userData = await this.authService.signup(dto);
    res.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    delete userData.tokens.accessToken;
    return userData;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signin')
  async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res,
  ) {
    const userData = await this.authService.signin(dto);

    res.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    
    delete userData.tokens.accessToken;
    return userData;
  }
}
