import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Menu from 'src/types/entity/menu.entity';
import { menusSeed } from 'src/types/seeds';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async create(menu: CreateMenuDto): Promise<Menu> {
    const dbMenu = await this.menuRepository.findOneBy({ name: menu.name });
    if (dbMenu)
      throw new BadRequestException('Menu with this name is already exist');

    return await this.menuRepository.save(menu);
  }

  async findAll() {
    return await this.menuRepository.find();
  }

  async getAllForPrompt(id: number) {
    return await this.menuRepository.find({
      where: { id: id },
      relations: ['menuItems'],
    });
  }

  async findOne(id: number) {
    const dbMenu = await this.menuRepository.findOne({
      where: { id },
      relations: ['menuItems', 'quizes', 'restaurant'],
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
      relations: ['menuItems', 'quizes', 'restaurant'],
    });
    if (!dbMenu) throw new NotFoundException('Menu not found');

    await dbMenu.menuItems.splice(0, dbMenu.menuItems.length);

    // for await (const quiz of dbMenu.quizes) {
    //   await this.quizService.remove(quiz.id);
    // }
    dbMenu.restaurant = null;

    await this.menuRepository.save(dbMenu);

    return await this.menuRepository.remove(dbMenu);
  }

  async saveMenuToDB(menu: Menu) {
    return await this.menuRepository.save(menu);
  }

  async seed() {
    for await (const menu of menusSeed) {
      const isExist = await this.menuRepository.findOne({
        where: { name: menu.name },
      });
      if (!isExist) {
        const dbRestaurant = await this.menuRepository.create(<CreateMenuDto>{
          ...menu,
        });

        await this.menuRepository.save(dbRestaurant);
        console.log(`Menu ${menu.name} seeded`);
      }
    }
  }
}
