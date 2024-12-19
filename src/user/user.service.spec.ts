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

  let userPassword = 'qwertyuiop';

  let userExample = {
    id: 1,
    firstName: 'John',
    lastName: 'Morgan',
    username: 'JMTheBest',
    email: 'JM@mail.com',
    phoneNumber: '+380000000000',
    role: 'admin',
    password: userPassword,
  };

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
          id: undefined,
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
    userExample = dbUser;
  });

  it('should return jwt payload', async () => {
    const result = await userService.validateUser(
      userExample.username,
      '',
      '',
      userPassword,
    );

    expect(result).toEqual({
      id: userExample.id,
      username: userExample.username,
      role: userExample.role,
      email: userExample.email,
    });
  });

  it('should update password and save existing user', async () => {
    const newPassword = 'asdfghjkl';
    await userService.updatePassword(<UpdateUserPasswordDto>{
      userId: userExample.id,
      newPassword,
    });

    const password = (await userRepository.findOneBy({ id: userExample.id }))
      .password;

    expect(bcrypt.compareSync(newPassword, password)).toBe(true);
    userPassword = newPassword;
  });

  it('should update role and save existing user', async () => {
    const result = await userService.updateRole(<UpdateUserRoleDto>{
      userId: userExample.id,
      role: 'admin',
    });

    expect(result).toEqual({ ...userExample, role: 'admin' });
  });

  it('should update user and save existing user', async () => {
    const updateUser = {
      firstName: 'Leny',
      lastName: 'Salvinskiy',
      email: 'LSBest@mail.com',
    };

    const result = await userService.updateUser(
      userExample.id,
      <UpdateUserDto>updateUser,
    );
    userExample = { ...userExample, ...updateUser };

    expect(result).toEqual(userExample);
  });

  it('should delete an existing user', async () => {
    const result = await userService.removeUser(userExample.id);

    expect({
      ...result,
      id: userExample.id,
      password: userExample.password,
    }).toEqual(userExample);
    expect(bcrypt.compareSync(userPassword, result.password)).toBe(true);
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
