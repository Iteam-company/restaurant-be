import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokens } from 'src/types/entity/refresh-tokens';
import PayloadType from 'src/types/PayloadType';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(RefreshTokens)
    private refreshTokensRepository: Repository<RefreshTokens>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly configService: ConfigService,
  ) {}

  async login(payload: PayloadType) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: await this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: await this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.refreshTokensRepository.save({
      token: refreshToken,
      user: await this.userService.getUserById(payload.id),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refresh: string) {
    const tokenEntity = await this.refreshTokensRepository.findOne({
      where: { token: refresh },
      relations: ['user'],
    });
    if (!tokenEntity) throw new UnauthorizedException('Invalid refresh token');

    try {
      const { iat, exp, ...rest } = this.jwtService.verify(refresh, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      void iat;
      void exp;

      const accessToken = this.jwtService.sign(rest, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });
      return { access_token: accessToken };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Expired or invalid refresh token');
    }
  }

  async logout(refresh: string) {
    const tokenEntity = await this.refreshTokensRepository.findOne({
      where: { token: refresh },
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokensRepository.remove(tokenEntity);

    return { message: 'Logged out successfully' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async removeExpiredRefreshTokens() {
    await this.refreshTokensRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();

    const logger = new Logger('AuthService');
    logger.log('Expired refresh tokens cleaned up');
  }
}
