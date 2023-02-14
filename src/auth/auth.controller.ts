import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(
    @Body() dto: any,
    @Res({ passthrough: true }) res,
  ) {

    const userData = await this.authService.signup(dto);
    res.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res,
  ) {
    const userData = await this.authService.signin(dto);

    res.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return userData;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('logout')
  logout(@Res({ passthrough: true }) res) {
    const { refreshToken } = res.req.cookies;

    this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.redirect(process.env.CLIENT_URL + '/signin');
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Res({ passthrough: true }) res) {
    const { refreshToken } = res.req.cookies;
    const userData = await this.authService.refresh(
      refreshToken,
    );

    res.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return userData;
  }
}
