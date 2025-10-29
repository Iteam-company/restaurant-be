import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User, { UserRole } from 'src/types/entity/user.entity';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserPasswordDto from './dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';
import UpdateUserRoleDto from './dto/update-user-role.dto';
import UpdateUserDto from './dto/update-user.dto';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import PayloadType from 'src/types/PayloadType';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { AuthModule } from 'src/auth/auth.module';
import { BadRequestException } from '@nestjs/common';
import { TestDataSource } from 'src/test-data-source';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { EventsModule } from 'src/events/events.module';

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
    role: UserRole.ADMIN,
    password: userPassword,
  };

  let userResource: User;

  const csv = `firstName,lastName,username,role,email,phoneNumber,password
John,Morgan,waiter,waiter,waiter0@mail.com,+380000000010,qwertyuiop
John,Morgan,waiter1,waiter,waiter10@mail.com,+380000000011,qwertyuiop
John,Morgan,waiter2,waiter,waiter20@mail.com,+380000000012,qwertyuiop`;

  const usersValidation = [
    { email: 'waiter0@mail.com', password: 'qwertyuiop' },
    { email: 'waiter10@mail.com', password: 'qwertyuiop' },
    { email: 'waiter20@mail.com', password: 'qwertyuiop' },
  ];

  const users = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(TestDataSource.options),
        TypeOrmModule.forFeature([User]),
        AuthModule,
        SharedJwtAuthModule,
        RestaurantModule,
        EventsModule,
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
      icon: null,
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
      phoneNumber: userResource.phoneNumber,
      restaurantId: undefined,
      icon: null,
    });
  });

  it('should create few users', async () => {
    const errors = await userService.uploadUsers(csv);

    expect(errors).toEqual([]);

    for await (const user of usersValidation) {
      const dbUser = await userService.validateUser(
        '',
        user.email,
        '',
        user.password,
      );

      expect(dbUser).toBeDefined();

      users.push({ ...dbUser, ...user });
    }
  });

  it('should remove few users and create again', async () => {
    await userService.removeUser(users[0].id);
    await userService.removeUser(users[1].id);

    const errors = await userService.uploadUsers(csv);

    expect(errors).toEqual([
      {
        error: new BadRequestException(
          'User with this email, phone number or username is already exist',
        ),
        user: {
          email: 'waiter20@mail.com',
          firstName: 'John',
          lastName: 'Morgan',
          password: 'qwertyuiop',
          phoneNumber: '+380000000012',
          role: 'waiter',
          username: 'waiter2',
        },
      },
    ]);

    for await (const user of users) {
      expect(
        await userService.validateUser('', user.email, '', user.password),
      ).toBeDefined();
    }
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
      <PayloadType>{},
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
