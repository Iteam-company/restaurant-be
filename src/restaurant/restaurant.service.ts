import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import CreateUpdateRestaurantDto from 'src/restaurant/dto/update-restaurant.dto';
import Restaurant from 'src/types/entity/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { join } from 'path';
import { paginate } from 'nestjs-paginate';
import SearchQueryDto from './dto/search-query.dto';
import { restaurantsSeed } from 'src/types/seeds';

@Injectable()
export class RestaurantService implements OnModuleInit {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async getRestaurant(id: number) {
    const dbRestaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.workers', 'user')
      .leftJoinAndSelect('restaurant.menu', 'menu')
      .select([
        'restaurant',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.role',
        'user.email',
        'user.phoneNumber',
        'menu',
      ])
      .where('restaurant.id = :id', { id })
      .getOne();

    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    return dbRestaurant;
  }

  async getAllOwnerRestaurants(id: number) {
    const dbUser = await this.userService.getUserById(id);
    if (!dbUser) throw new NotFoundException('Owner with this id is not exist');

    return await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.workers', 'user')
      .leftJoinAndSelect('restaurant.menu', 'menu')
      .select([
        'restaurant',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.role',
        'user.email',
        'user.phoneNumber',
        'menu',
      ])
      .where('restaurant.owner = :owner', { owner: dbUser.id })
      .getMany();
  }

  async getSearch(query: SearchQueryDto) {
    return (
      await paginate<Restaurant>(query, this.restaurantRepository, {
        sortableColumns: ['id'],
        relations: ['menu', 'owner', 'workers'],
        select: [
          'id',
          'name',
          'address',
          'image',
          'menu.id',
          'owner.id',
          'owner.firstName',
          'owner.lastName',
          'owner.userName',
          'owner.role',
          'owner.email',
          'owner.phoneNumber',
          'owner.icon',
          'workers.id',
          'workers.firstName',
          'workers.lastName',
          'workers.userName',
          'workers.role',
          'workers.email',
          'workers.phoneNumber',
          'workers.icon',
        ],
        searchableColumns: ['name', 'address'],
      })
    ).data;
  }

  async createRestaurant(restaurant: CreateRestaurantDto, url: string) {
    const dbUser = await this.userService.getUserById(restaurant.ownerId);
    if (!dbUser) throw new NotFoundException('Owner with this id is not exist');

    if (dbUser.role !== 'owner')
      throw new BadRequestException('User with this id is not owner');

    return await this.restaurantRepository.save({
      ...restaurant,
      image: url,
      owner: dbUser,
    });
  }

  async changeRestaurant(id: number, restaurant: CreateUpdateRestaurantDto) {
    const dbRestaurant = await this.restaurantRepository.findOneBy({
      id: id,
    });
    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    await this.restaurantRepository.update(id, restaurant);

    return await this.getRestaurant(id);
  }

  async updateImage(id: number, imageUrl: string) {
    const dbRestaurant = await this.getRestaurant(id);
    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    if (dbRestaurant.image)
      await this.removeCloudinaryImage(dbRestaurant.image);

    await this.restaurantRepository.update(id, { image: imageUrl });

    return { imageUrl };
  }

  async removeRestaurant(id: number) {
    const dbRestaurant = await this.restaurantRepository.findOne({
      where: { id: id },
      relations: ['workers'],
    });
    if (!dbRestaurant) throw new NotFoundException('Restaurant not found');

    for await (const worker of dbRestaurant.workers) {
      await this.removeWorker(worker.id, id);
    }

    if (dbRestaurant.image)
      await this.removeCloudinaryImage(dbRestaurant.image);

    return await this.restaurantRepository.remove(dbRestaurant);
  }

  async addWorker(userId: number, restaurantId: number) {
    const dbUser = await this.userService.getUserById(userId);
    if (!dbUser)
      throw new BadRequestException('User with this id is not exist');

    const dbRestaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['workers'],
    });
    if (!dbRestaurant)
      throw new BadRequestException('Restaurant with this id is not exist');

    await dbRestaurant.workers.push(dbUser);

    return await this.restaurantRepository.save(dbRestaurant);
  }

  async removeWorker(userId: number, restaurantId: number) {
    const dbUser = await this.userService.getUserById(userId);
    if (!dbUser)
      throw new BadRequestException('User with this id is not exist');

    const dbRestaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['workers'],
    });
    if (!dbRestaurant)
      throw new BadRequestException('Restaurant with this id is not exist');

    await dbRestaurant.workers.splice(
      await dbRestaurant.workers.findIndex((elem) => elem.id === dbUser.id),
      1,
    );

    return await this.restaurantRepository.save(dbRestaurant);
  }

  async removeCloudinaryImage(image: string) {
    const url = image.split('/');
    await cloudinary.api.delete_resources([
      join('restaurants', url[url.length - 1].split('.')[0]),
    ]);
  }

  async seed() {
    for await (const restaurant of restaurantsSeed) {
      const isExist = await this.restaurantRepository.findOne({
        where: { address: restaurant.address },
      });
      if (!isExist) {
        const owner = await this.userService.getSearch(
          {
            path: undefined,
            search: restaurant.ownerUsername,
          },
          'owner',
        );
        const dbRestaurant = await this.restaurantRepository.create({
          ...restaurant,
          owner: owner[0],
        });

        await this.restaurantRepository.save(dbRestaurant);
        console.log(`Restaurant ${restaurant.name} seeded`);
      }
    }
  }
}
