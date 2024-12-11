import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import CreateUpdateRestaurantDto from 'src/restaurant/dto/update-restaurant.dto';
import Restaurant from 'src/types/entity/restaurant.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    private readonly userService: UserService,
  ) {}

  async getRestaurant(id: number) {
    const dbRestaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.workers', 'user')
      .select([
        'restaurant',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.role',
        'user.email',
        'user.phoneNumber',
      ])
      .where('restaurant.id = :id', { id })
      .getOne();

    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    return dbRestaurant;
  }

  async createRestaurant(restaurant: CreateRestaurantDto) {
    return await this.restaurantRepository.save(restaurant);
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

  async removeRestaurant(id: number) {
    const dbRestaurant = await this.restaurantRepository.findOne({
      where: { id: id },
      relations: ['workers'],
    });
    if (!dbRestaurant) throw new NotFoundException('Restaurant not found');

    for await (const worker of dbRestaurant.workers) {
      await this.removeWorker(worker.id, id);
    }

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
}
