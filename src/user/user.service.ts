import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDto from 'src/types/dto/create-user.dto';

@Injectable()
export class UserService {
  private users: ({ id: number } & CreateUserDto)[] = [
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
  ];

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
    return { ...user, id: 10 };
  }
}
