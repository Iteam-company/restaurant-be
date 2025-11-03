import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import PayloadType from 'src/types/PayloadType';
import { AuthGuard } from './auth.guard';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserRole } from 'src/types/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDataSource } from 'src/test-data-source';
import { RefreshTokens } from 'src/types/entity/refresh-tokens';

describe('AuthService', () => {
  let authService: AuthService;
  let authGuard: AuthGuard;

  const payloadExample: PayloadType = {
    id: 1,
    username: 'JMTheBest',
    role: UserRole.WAITER,
    email: 'JM@mail.com',
    icon: null,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedJwtAuthModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(TestDataSource.options),
        TypeOrmModule.forFeature([RefreshTokens]),
      ],
      providers: [AuthService, AuthGuard],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  // beforeEach(async () => {
  //   await TestDataSource.initialize();
  //   await TestDataSource.getRepository(RefreshTokens).clear();
  // });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
    expect(authGuard).toBeDefined();
  });

  it('should create and validate tokens', async () => {
    const userPayload = {
      ...payloadExample,
      id: new Date().getMilliseconds(),
    };
    const jwtToken = await authService.login(userPayload);

    expect(jwtToken).toBeDefined();
    expect({
      ...(await authGuard.validateToken(jwtToken.access_token)),
      exp: undefined,
      iat: undefined,
    }).toEqual(userPayload);

    expect(jwtToken).toBeDefined();
    expect({
      ...(await authGuard.validateToken(jwtToken.access_token)),
      exp: undefined,
      iat: undefined,
    }).toEqual(userPayload);
  });

  it('should return access_token from refresh_token', async () => {
    const userPayload = {
      ...payloadExample,
      id: new Date().getMilliseconds(),
    };
    const { refresh_token } = await authService.login(userPayload);

    const { access_token } = await authService.refresh(refresh_token);

    expect(access_token).toBeDefined();
    expect({
      ...(await authGuard.validateToken(access_token)),
      exp: undefined,
      iat: undefined,
    }).toEqual(userPayload);
  });

  it('should logout user', async () => {
    const userPayload = {
      ...payloadExample,
      id: new Date().getMilliseconds(),
    };
    const { refresh_token } = await authService.login(userPayload);

    const result = await authService.logout(refresh_token);

    expect(result).toBeDefined();
  });
});
