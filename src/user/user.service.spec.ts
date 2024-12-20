import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserPasswordDto from './dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';
import UpdateUserRoleDto from './dto/update-user-role.dto';
import UpdateUserDto from './dto/update-user.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import PayloadType from 'src/types/PayloadType';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { AuthModule } from 'src/auth/auth.module';

describe('UserService', () => {
  let userService: UserService;

  let userRepository: Repository<User>;

  let userPassword: string = 'qwertyuiop';

  const userExample: CreateUserDto = {
    firstName: 'John',
    lastName: 'Morgan',
    username: 'JMTheBest1',
    email: 'JM1@mail.com',
    phoneNumber: '+380000000004',
    role: 'admin',
    password: userPassword,
  };

  let userResource: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('TEST_DB_CONNECT'),
            entities: [
              User,
              Restaurant,
              Menu,
              MenuItem,
              Quiz,
              Question,
              QuizResult,
            ],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([User]),
        AuthModule,
        SharedJwtAuthModule,
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get('UserRepository');
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should create and save a new user', async () => {
    const result = await parseJwt(
      (
        await userService.createUser(<CreateUserDto>{
          ...userExample,
        })
      ).access_token,
    );
    const dbUser = await userService.getUserById(result.id);

    expect({ ...result, exp: undefined, iat: undefined }).toEqual({
      id: result.id,
      email: userExample.email,
      role: userExample.role,
      username: userExample.username,
    });
    expect(dbUser).toEqual({
      ...userExample,
      id: result.id,
      password: undefined,
    });
    userResource = dbUser;
  });

  it('should return jwt payload', async () => {
    const result = await userService.validateUser(
      userResource.username,
      '',
      '',
      userPassword,
    );

    expect(result).toEqual({
      id: userResource.id,
      username: userResource.username,
      role: userResource.role,
      email: userResource.email,
    });
  });

  it('should update password and save existing user', async () => {
    const newPassword = 'asdfghjkl';
    await userService.updatePassword(<UpdateUserPasswordDto>{
      userId: userResource.id,
      newPassword,
    });

    const password = (await userRepository.findOneBy({ id: userResource.id }))
      .password;

    expect(bcrypt.compareSync(newPassword, password)).toBe(true);
    userPassword = newPassword;
  });

  it('should update role and save existing user', async () => {
    const result = await userService.updateRole(<UpdateUserRoleDto>{
      userId: userResource.id,
      role: 'admin',
    });

    expect(result).toEqual({ ...userResource, role: 'admin' });
  });

  it('should update user and save existing user', async () => {
    const updateUser = {
      firstName: 'Leny',
      lastName: 'Salvinskiy',
      email: 'LSBest@mail.com',
    };

    const result = await userService.updateUser(
      userResource.id,
      <UpdateUserDto>updateUser,
    );
    userResource = { ...userResource, ...updateUser };

    expect(result).toEqual(userResource);
  });

  it('should delete an existing user', async () => {
    const result = await userService.removeUser(userResource.id);

    expect({
      ...result,
      id: userResource.id,
      password: userResource.password,
    }).toEqual(userResource);
    expect(bcrypt.compareSync(userPassword, result.password)).toBe(true);
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
