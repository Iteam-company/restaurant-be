import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from 'src/user/dto/create-user.dto';
import User from 'src/types/entity/user.entity';
import { Repository } from 'typeorm';
import UpdateUserPasswordDto from 'src/user/dto/update-user-password.dto';
import * as bcrypt from 'bcrypt';
import UpdateUserRoleDto from 'src/user/dto/update-user-role.dto';
import { AuthService } from 'src/auth/auth.service';
import PayloadType from 'src/types/PayloadType';
import UpdateUserDto from 'src/user/dto/update-user.dto';
import { v2 as cloudinary } from 'cloudinary';
import { join } from 'path';
import SearchQueryDto from './dto/search-param.dto';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getUserById(id: number) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('User not found');

    return { ...dbUser, password: undefined };
  }

  async getSearch(query: SearchQueryDto) {
    const dbUsers = await this.userRepository.createQueryBuilder('user');

    dbUsers.andWhere('user.role = :role', { role: 'waiter' });
    return (
      await paginate(query, dbUsers, {
        sortableColumns: ['id'],
        relations: ['restaurant'],
        select: [
          'id',
          'username',
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'icon',
          'role',
          'restaurant.id',
          'restaurant.address',
          'restaurant.name',
          'restaurant.image',
        ],
        searchableColumns: [
          'username',
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
        ],
      })
    ).data;
  }

  async onModuleInit() {
    await this.seed();
  }

  async validateUser(
    username: string,
    email: string,
    phoneNumber: string,
    password: string,
  ) {
    const user = await this.userRepository.findOne({
      where: [
        { username: username ?? '' },
        { email: email || '' },
        { phoneNumber: phoneNumber ?? '' },
      ],
    });
    if (!user) throw new UnauthorizedException();

    if (!(await this.comparePassword(password, user.password)))
      throw new UnauthorizedException();

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      icon: user.icon,
    };
  }

  async createUser(user: CreateUserDto) {
    const dbUser = await this.userRepository.findOne({
      where: [
        { email: user.email },
        { phoneNumber: user.phoneNumber },
        { username: user.username },
      ],
    });
    if (dbUser)
      throw new BadRequestException(
        'User with this email, phone number or username is already exist',
      );

    const savedUser = await this.userRepository.save({
      ...user,
      password: await this.hashPassword(user.password),
    });

    return await this.authService.login(<PayloadType>{
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
      email: savedUser.email,
    });
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

  async updateIcon(id: number, imageUrl: string) {
    const dbUser = await this.userRepository.findOneBy({ id });
    if (!dbUser) throw new NotFoundException('User with this id is not exist');

    if (dbUser.icon) await this.removeCloudinaryImage(dbUser);

    await this.userRepository.update(id, { icon: imageUrl });

    return { imageUrl };
  }

  async removeUser(id: number) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('User not found');

    if (dbUser.icon) await this.removeCloudinaryImage(dbUser);

    return await this.userRepository.remove(dbUser);
  }

  private readonly saltRounds = 10;

  private async removeCloudinaryImage(dbUser: User) {
    const url = dbUser.icon.split('/');
    await cloudinary.api.delete_resources([
      join('icons', url[url.length - 1].split('.')[0]),
    ]);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async seed() {
    // Check if admin exists
    const adminExists = await this.userRepository.findOne({
      where: { email: 'test@gmail.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('12345678', 10);

      const admin = this.userRepository.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        role: 'admin',
        email: 'test@gmail.com',
        phoneNumber: '+1234567890',
        password: hashedPassword,
      });

      await this.userRepository.save(admin);
      console.log('Admin user seeded');
    }
  }
}
