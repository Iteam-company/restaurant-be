import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Menu from 'src/types/entity/menu.entity';
import Restaurant from 'src/types/entity/restaurant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuLinkService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async linkMenuToRestaurant(menuId: number, restaurantId: number) {
    const dbMenu = await this.menuRepository.findOneBy({ id: menuId });
    if (!dbMenu)
      throw new BadRequestException('Menu with this id is not exist');

    const dbRestaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });

    if (!dbRestaurant)
      throw new BadRequestException('Restaurant with this id is not exist');

    dbMenu.restaurant = dbRestaurant;

    await this.menuRepository.save(dbMenu);

    return await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['menu', 'workers'],
    });
  }

  async unlinkMenuFromRestaurant(menuId: number, restaurantId: number) {
    const dbMenu = await this.menuRepository.findOneBy({ id: menuId });
    if (!dbMenu)
      throw new BadRequestException('Menu with this id is not exist');

    const dbRestaurant = await this.restaurantRepository.findOneBy({
      id: restaurantId,
    });
    if (!dbRestaurant)
      throw new BadRequestException('Restaurant with this id is not exist');

    dbMenu.restaurant = null;

    return await this.menuRepository.save(dbMenu);
  }
}
