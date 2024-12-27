import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MenuItem from 'src/types/entity/menu-item.entity';
import Menu from 'src/types/entity/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { menuItemsSeed, menusSeed } from 'src/types/seeds';

@Injectable()
export class ItemService implements OnModuleInit {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async create(menuItem: CreateMenuItemDto) {
    const dbItem = await this.menuItemRepository.findOneBy({
      name: menuItem.name,
    });
    if (dbItem)
      throw new BadRequestException('Menu item with this id is already exist');

    return await this.menuItemRepository.save(menuItem);
  }

  async getMenu(menuId: number) {
    return await this.menuRepository.findBy({ id: menuId });
  }

  async changeItem(menuItemId: number, item: UpdateMenuItemDto) {
    const dbMenuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
    });
    if (!dbMenuItem)
      throw new BadRequestException('Menu item with this id is not exist');

    await this.menuItemRepository.update(menuItemId, item);

    return await this.menuItemRepository.findOneBy({ id: menuItemId });
  }

  async remove(menuItemId: number) {
    const dbItem = await this.menuItemRepository.findOneBy({ id: menuItemId });
    if (!dbItem) throw new NotFoundException('Menu item not found');

    return await this.menuItemRepository.remove(dbItem);
  }

  async linkItem(menuId: number, menuItemId: number) {
    const dbMenuItem = await this.menuItemRepository.findOneBy({
      id: menuItemId,
    });
    if (!dbMenuItem)
      throw new BadRequestException('MenuItem with this id is not exist');

    const dbMenu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['menuItems'],
    });
    if (!dbMenu)
      throw new BadRequestException('Menu with this id is not exist');

    await dbMenu.menuItems.push(dbMenuItem);

    return await this.menuRepository.save(dbMenu);
  }

  async unlinkItem(menuId: number, menuItemId: number) {
    const dbMenuItem = await this.menuItemRepository.findOneBy({
      id: menuItemId,
    });
    if (!dbMenuItem)
      throw new BadRequestException('MenuItem with this id is not exist');

    const dbMenu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['menuItems'],
    });
    if (!dbMenu)
      throw new BadRequestException('Menu with this id is not exist');

    await dbMenu.menuItems.splice(
      await dbMenu.menuItems.findIndex((elem) => elem.id === dbMenuItem.id),
      1,
    );

    return await this.menuRepository.save(dbMenu);
  }

  async seed() {
    for await (const menuItem of menuItemsSeed) {
      const isExist = await this.menuItemRepository.findOne({
        where: { name: menuItem.name },
      });
      if (!isExist) {
        const dbMenuItem = await this.menuItemRepository.save(
          <CreateMenuItemDto>menuItem,
        );
        console.log(`MenuItem ${menuItem.name} seeded`);

        for await (const menu of menusSeed) {
          if (
            menu.menuItemNames.findIndex((elem) => elem === dbMenuItem.name) !==
            -1
          ) {
            const dbMenu = await this.menuRepository.findOneBy({
              name: menu.name,
            });

            await this.linkItem(dbMenu.id, dbMenuItem.id);
            console.log(`MenuItem ${menu.name} linked`);
          }
        }
      }
    }
  }
}
