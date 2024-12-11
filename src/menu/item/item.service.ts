import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MenuItem from 'src/types/entity/menu-item.entity';
import Menu from 'src/types/entity/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async create(menuItem: CreateMenuItemDto) {
    const dbItem = await this.menuItemRepository.findOneBy({
      name: menuItem.name,
    });
    if (dbItem)
      throw new BadRequestException('Menu item with this id is already exist');

    return await this.menuItemRepository.save(menuItem);
  }

  async getMenu(menuId: number) {
    return await this.menuItemRepository.findBy({ id: menuId });
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
}
