import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Menu from 'src/types/entity/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async create(menu: CreateMenuDto) {
    const dbMenu = await this.menuRepository.findOneBy({ name: menu.name });
    if (dbMenu)
      throw new BadRequestException('Menu with this name is already exist');

    return await this.menuRepository.save(menu);
  }

  async findAll() {
    return await this.menuRepository.find();
  }

  async findOne(id: number) {
    const dbMenu = await this.menuRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!dbMenu) throw new NotFoundException('Menu with this id is not exist');

    return dbMenu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const dbMenu = await this.findOne(id);
    if (!dbMenu) throw new NotFoundException('Menu with this id is not exist');

    await this.menuRepository.update(id, updateMenuDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const dbMenu = await this.menuRepository.findOne({
      where: { id: id },
      relations: ['menuItems'],
    });
    if (!dbMenu) throw new NotFoundException('Menu not found');

    await dbMenu.menuItems.splice(0, dbMenu.menuItems.length);

    await this.menuRepository.save(dbMenu);

    return await this.menuRepository.remove(dbMenu);
  }
}