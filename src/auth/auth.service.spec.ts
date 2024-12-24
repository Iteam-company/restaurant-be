import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import PayloadType from 'src/types/PayloadType';
import { AuthGuard } from './auth.guard';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let authGuard: AuthGuard;

  const payloadExample: PayloadType = {
    id: 1,
    username: 'JMTheBest',
    role: 'waiter',
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
      ],
      providers: [AuthService, AuthGuard],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
    expect(authGuard).toBeDefined();
  });

  it('should create and validate token', async () => {
    const jwtToken = await authService.login({ ...payloadExample });

    expect(jwtToken).toBeDefined();
    expect({
      ...(await authGuard.validateToken(jwtToken.access_token)),
      exp: undefined,
      iat: undefined,
    }).toEqual(payloadExample);
  });
});
