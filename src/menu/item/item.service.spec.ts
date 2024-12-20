import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { ItemService } from './item.service';
import { MenuService } from '../menu.service';
import { MenuModule } from '../menu.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from '../dto/create-menu.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

describe('UserService', () => {
  let itemService: ItemService;
  let menuService: MenuService;

  let itemRepository: Repository<MenuItem>;

  const itemExample: CreateMenuItemDto = {
    name: 'Caezar',
    description: 'Salat cezar',
    ingredients: 'inifjvnijmsl,pql,xlwemokrmv',
    timeForCook: '60 min',
    price: 130,
  };

  const menuExample: CreateMenuDto = {
    name: 'Fall hits',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.FALL,
  };

  let itemResource: MenuItem;
  let menuResource: Menu;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('TEST_DB_CONNECT'),
            entities: [
              User,
              Restaurant,
              Menu,
              MenuItem,
              Quiz,
              Question,
              QuizResult,
            ],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([Question, QuizResult, Menu, MenuItem]),
        MenuModule,
        SharedJwtAuthModule,
      ],
      providers: [ItemService],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    menuService = module.get<MenuService>(MenuService);
    itemRepository = module.get('MenuItemRepository');
  });

  it('should be defined', async () => {
    expect(itemService).toBeDefined();
    expect(menuService).toBeDefined();
    expect(itemRepository).toBeDefined();
  });

  it('should create and save a new item', async () => {
    const result = await itemService.create(itemExample);

    expect(result).toEqual({
      ...itemExample,
      id: result.id,
    });
    itemResource = result;
  });

  it('should update and save existed item', async () => {
    const updateData = {
      ingredients: 'salat, egg, tomato',
    };
    const result = await itemService.changeItem(itemResource.id, updateData);

    expect(result).toEqual({ ...itemResource, ...updateData });

    itemResource = { ...itemResource, ...updateData };
  });

  it('should add existing item to existing menu', async () => {
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    const dbMenuWithItem = await itemService.linkItem(
      dbMenu.id,
      itemResource.id,
    );

    expect(dbMenuWithItem).toEqual({
      ...dbMenu,
      menuItems: [itemResource],
      quizes: undefined,
      restaurant: undefined,
    });
    menuResource = {
      ...dbMenu,
      menuItems: [itemResource],
    };
  });

  it('should remove existing item from existing menu', async () => {
    const result = await itemService.unlinkItem(
      menuResource.id,
      itemResource.id,
    );

    expect(result).toEqual({
      ...menuResource,
      menuItems: [],
    });
  });

  it('should link item to menu and delete item', async () => {
    await itemService.linkItem(menuResource.id, itemResource.id);
    const result = await itemService.remove(itemResource.id);
    const dbMenu = await menuService.findOne(menuResource.id);

    expect(result).toEqual({ ...itemResource, id: undefined });
    expect({
      ...dbMenu,
      quizes: undefined,
      restaurant: undefined,
    }).toEqual({
      ...menuResource,
      menuItems: [],
    });

    menuResource = dbMenu;
  });

  it('should create and link item and after delete menu', async () => {
    const dbItem = await itemService.create(itemResource);
    await itemService.linkItem(menuResource.id, dbItem.id);

    const result = await menuService.remove(menuResource.id);
    const itemResult = await itemRepository.findOne({
      where: { id: dbItem.id },
      relations: ['menu'],
    });

    expect(result).toEqual({ ...menuResource, id: undefined });
    expect(itemResult.menu).toBeNull();
  });
});
