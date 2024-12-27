import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Menu from 'src/types/entity/menu.entity';
import Restaurant from 'src/types/entity/restaurant.entity';
import { restaurantsSeed } from 'src/types/seeds';
import { Repository } from 'typeorm';

@Injectable()
export class MenuLinkService implements OnModuleInit {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async onModuleInit() {
    this.seed();
  }

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

    return await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.workers', 'user')
      .leftJoinAndSelect('restaurant.menu', 'menu')
      .select([
        'restaurant',
        'menu',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.role',
        'user.email',
        'user.phoneNumber',
      ])
      .where('restaurant.id = :id', { id: restaurantId })
      .getOne();
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

  async seed() {
    for await (const restaurant of restaurantsSeed) {
      for await (const menu of restaurant.menuNames) {
        const dbMenu = await this.menuRepository.findOne({
          where: { name: menu },
          relations: ['restaurant'],
        });
        if (dbMenu === null || dbMenu?.restaurant !== null) continue;

        await this.linkMenuToRestaurant(
          dbMenu.id,
          (
            await this.restaurantRepository.findOneBy({
              address: restaurant.address,
            })
          ).id,
        );
        console.log(`MenuLink ${menu} seeded`);
      }
    }
  }
}
