import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, JwtStrategy],
})
export class TokenModule {}
