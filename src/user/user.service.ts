import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDto from 'src/types/dto/create-user.dto';
import UserType from 'src/types/UserType';

@Injectable()
export class UserService {
  private users: UserType[] = [
    {
      id: 1,
      firstName: 'q',
      lastName: 'qq',
      username: 'admin',
      role: 'admin',
      email: 'qq@gmail.com',
      phoneNumber: '+3800000000',
      password: 'qwertyuiop',
    },
    {
      id: 2,
      firstName: 'qq',
      lastName: 'q',
      username: 'not admin',
      role: 'waiter',
      email: 'qq@gmail.com',
      phoneNumber: '+3800000000',
      password: 'qwertyuiop',
    },
  ];

  async getUserById(id: number) {
    const dbUser = await this.users.find((elem) => elem.id === id);
    if (!dbUser) throw new NotFoundException('User not found');

    return { ...dbUser, password: undefined };
  }

  async validateUser(username: string, password: string) {
    const user = this.users.find(
      (elem) => elem.username === username && elem.password === password,
    );
    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  }

  async createUser(user: CreateUserDto) {
    const dbUser = await this.users.find(
      (elem) => elem.email === user.email || elem.username === user.username,
    );
    if (dbUser)
      throw new BadRequestException(
        'User with this email or username is already exist',
      );

    await this.users.push({ ...user, id: 10 });
    return { ...user, id: this.users.length };
  }

  async updateUser(id: number, user: Partial<CreateUserDto>) {
    const dbUser = await this.users.find((elem) => elem.id === id);
    if (!dbUser)
      throw new BadRequestException('User with this id is not exist');

    const newUser = { ...dbUser, ...user, id, password: dbUser.password };

    this.users[await this.users.findIndex((elem) => elem.id === id)] = newUser;

    return newUser;
  }

  async removeUser(id: number) {
    const dbUserIndex = await this.users.findIndex((elem) => elem.id === id);
    if (dbUserIndex === -1) throw new NotFoundException('User not found');

    return await this.users.splice(dbUserIndex, 1);
  }
}
