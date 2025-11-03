import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokens } from 'src/types/entity/refresh-tokens';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    TypeOrmModule.forFeature([RefreshTokens]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
