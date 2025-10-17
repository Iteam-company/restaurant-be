import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from 'src/user/dto/create-user.dto';
import User, { UserRole } from 'src/types/entity/user.entity';
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
import * as CSV from 'csv-string';
import { stringify } from 'csv-stringify';
import { usersSeed } from 'src/types/seeds';
import { ConfigService } from '@nestjs/config';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly configService: ConfigService,

    private readonly restaurantService: RestaurantService,
  ) {}

  async uploadUsers(csv: string) {
    const newUsers = await CSV.parse(csv, {
      output: 'objects',
    });

    const errorUsers = [];

    for await (const user of await JSON.parse(await JSON.stringify(newUsers))) {
      try {
        await this.createUser(<CreateUserDto>user);
      } catch (error) {
        await errorUsers.push({ user, error });
      }
    }
    return errorUsers;
  }

  async getUserCsv() {
    const dbUser = await this.userRepository.find({});

    const data = await new Promise<string>((resolve, reject) => {
      stringify(
        dbUser,
        {
          header: true,
          columns: [
            'firstName',
            'lastName',
            'username',
            'email',
            'phoneNumber',
            'role',
          ],
        },
        (err, output) => {
          if (err) {
            reject('Error generating CSV');
          } else {
            resolve(output);
          }
        },
      );
    });
    return { data };
  }

  async getOwners() {
    return await this.userRepository.find({
      where: { role: UserRole.OWNER },
    });
  }

  async getUserById(id: number) {
    const dbUser = await this.userRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('User not found');

    return { ...dbUser, password: undefined };
  }

  async getSearch(query: SearchQueryDto, role?: string) {
    const dbUsers = await this.userRepository.createQueryBuilder('user');

    if (role) {
      dbUsers.andWhere('user.role = :role', { role });
    }
    if (query.restaurantId) {
      dbUsers.andWhere('user.restaurant = :restaurantId', {
        restaurantId: +query.restaurantId,
      });
    }

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
      relations: ['restaurant'],
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
      phoneNumber: user.phoneNumber,
      restaurantId: user.role !== 'waiter' ? undefined : user.restaurant?.id,
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

    return {
      ...(await this.authService.login(<PayloadType>{
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
        email: savedUser.email,
      })),
      id: savedUser.id,
    };
  }

  async updateUser(id: number, user: UpdateUserDto, payload: PayloadType) {
    const dbUser = await this.userRepository.findOneBy({ id: id });

    if (dbUser.role === 'owner')
      throw new BadRequestException('User cannot change role from owner');

    let newUser;
    if (payload.role !== 'waiter' || dbUser.role !== payload.role) {
      await this.handleChangeRole(dbUser, user.role);
      newUser = {
        ...dbUser,
        ...user,
        id: dbUser.id,
        password: dbUser.password,
      };
    } else {
      newUser = {
        ...dbUser,
        ...user,
        id: dbUser.id,
        role: dbUser.role,
        password: dbUser.password,
      };
    }

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

  private async handleChangeRole(user: User, role: UserRole) {
    switch (role) {
      case 'admin':
        try {
          const dbRestaurant = await this.restaurantService.removeWorker(
            user.id,
            user.restaurant.id,
          );

          await this.restaurantService.addAdmin(user.id, dbRestaurant.id);
        } catch {}
        break;
      case 'waiter':
        try {
          const dbRestaurant = await this.restaurantService.removeAdmin(
            user.id,
            user.restaurant.id,
          );

          await this.restaurantService.addWorker(user.id, dbRestaurant.id);
        } catch {}
        break;
      case 'owner':
        throw new BadRequestException('User cannot change role to owner');
      default:
        break;
    }
  }

  async seed() {
    for await (const user of usersSeed) {
      const isExist = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!isExist) {
        const hashedPassword = await bcrypt.hash(
          user.password,
          this.saltRounds,
        );

        const dbUser = await this.userRepository.create(<CreateUserDto>{
          ...user,
          password: hashedPassword,
        });

        await this.userRepository.save(dbUser);
        console.log(`User ${user.username} seeded`);
      }
    }
  }
}
