import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateRestaurantDto from 'src/types/dto/create-restaurant.dto';
import CreateUpdateRestaurantDto from 'src/types/dto/update-restaurant.dto';
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
    const dbRestaurant = this.restaurantRepository.findOneBy({ id: id });
    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    return dbRestaurant;
  }

  async createRestaurant(restaurant: CreateRestaurantDto) {
    return await this.restaurantRepository.save(restaurant);
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

  async changeRestaurant(id: number, restaurant: CreateUpdateRestaurantDto) {
    const dbRestaurant = await this.restaurantRepository.findOneBy({
      id: id,
    });
    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    return await this.restaurantRepository.update(id, restaurant);
  }

  async removeRestaurant(id: number) {
    const dbUser = await this.restaurantRepository.findOneBy({ id: id });
    if (!dbUser) throw new NotFoundException('Restaurant not found');

    return await this.restaurantRepository.remove(dbUser);
  }
}
