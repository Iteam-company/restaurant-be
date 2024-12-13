import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from 'src/user/dto/create-user.dto';
import User from 'src/types/entity/user.entity';
import { Repository } from 'typeorm';
import UpdateUserPasswordDto from 'src/user/dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';
import UpdateUserRoleDto from 'src/user/dto/update-user-role.dto';
import UpdateUserDto from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('User not found');

    return { ...dbUser, password: undefined };
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneBy({
      username: username,
    });
    if (!user) throw new UnauthorizedException();

    if (!(await this.comparePassword(password, user.password)))
      throw new UnauthorizedException();

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  }

  async createUser(user: CreateUserDto) {
    const dbUser = await this.userRepository.findOneBy({
      email: user.email,
      phoneNumber: user.phoneNumber,
      username: user.username,
    });
    if (dbUser)
      throw new BadRequestException(
        'User with this email, phone number or username is already exist',
      );

    const savedUser = await this.userRepository.save({
      ...user,
      password: await this.hashPassword(user.password),
    });

    return await this.getUserById(savedUser.id);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser)
      throw new BadRequestException('User with this id is not exist');

    const newUser = {
      ...dbUser,
      ...user,
      id: dbUser.id,
      role: dbUser.role,
      password: dbUser.password,
    };

    await this.userRepository.update(id, newUser);

    return this.getUserById(id);
  }

  async updatePassword(body: UpdateUserPasswordDto) {
    const dbUser = await this.userRepository.findOneBy({ id: body.userId });
    if (!dbUser) throw new NotFoundException('User with this id is not exist');

    await this.userRepository.update(body.userId, {
      password: await this.hashPassword(body.newPassword),
    });

    return await this.getUserById(body.userId);
  }

  async updateRole(body: UpdateUserRoleDto) {
    const dbUser = await this.userRepository.findOneBy({ id: body.userId });
    if (!dbUser) throw new NotFoundException('User with this id is not exist');

    await this.userRepository.update(body.userId, {
      role: body.role,
    });

    return this.getUserById(body.userId);
  }

  async removeUser(id: number) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('User not found');

    return await this.userRepository.remove(dbUser);
  }

  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
