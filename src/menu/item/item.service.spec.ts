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
import { CreateMenuDto } from '../dto/create-menu.dto';

describe('UserService', () => {
  let itemService: ItemService;
  let menuService: MenuService;

  let itemRepository: Repository<MenuItem>;
  let menuRepository: Repository<Menu>;

  let itemExample = {
    id: 0,
    name: 'Cezar',
    description: 'Salat cezar',
    ingredients: 'inifjvnijmsl,pql,xlwemokrmv',
    timeForCook: '60 min',
    price: 130,
  };

  let menuExample = {
    id: 0,
    name: 'Fall hits',
    categories: 'main courses',
    season: 'fall',
    menuItems: [],
    restaurant: null,
    quizes: [],
  };

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
        TypeOrmModule.forFeature([Menu, MenuItem]),
        MenuModule,
        SharedJwtAuthModule,
      ],
      providers: [ItemService],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    menuService = module.get<MenuService>(MenuService);
    itemRepository = module.get('MenuItemRepository');
    menuRepository = module.get('MenuRepository');
  });

  it('should be defined', async () => {
    expect(itemService).toBeDefined();
    expect(menuService).toBeDefined();
    expect(itemRepository).toBeDefined();
    expect(menuRepository).toBeDefined();
  });

  it('should create and save a new item', async () => {
    const result = await itemService.create(itemExample);

    expect(result).toEqual({
      ...itemExample,
      id: result.id,
    });
    itemExample = result;
  });

  it('should update and save existed item', async () => {
    const updateData = {
      ingredients: 'salat, egg, tomato',
    };
    const result = await itemService.changeItem(itemExample.id, updateData);

    expect(result).toEqual({ ...itemExample, ...updateData });

    itemExample = { ...itemExample, ...updateData };
  });

  it('should add existing item to existing menu', async () => {
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    const dbMenuWithItem = await itemService.linkItem(
      dbMenu.id,
      itemExample.id,
    );

    expect(dbMenuWithItem).toEqual({
      ...dbMenu,
      menuItems: [itemExample],
      quizes: undefined,
      restaurant: undefined,
    });
    menuExample = {
      ...dbMenu,
      menuItems: [itemExample],
    };
  });

  it('should remove existing item from existing menu', async () => {
    const result = await itemService.unlinkItem(menuExample.id, itemExample.id);

    expect(result).toEqual({
      ...menuExample,
      menuItems: [],
      quizes: undefined,
      restaurant: undefined,
    });
  });

  it('should link item to menu and delete item', async () => {
    await itemService.linkItem(menuExample.id, itemExample.id);
    const result = await itemService.remove(itemExample.id);
    const dbMenu = await menuService.findOne(menuExample.id);

    expect(result).toEqual({ ...itemExample, id: undefined });
    expect(dbMenu).toEqual({ ...menuExample, menuItems: [] });

    menuExample = dbMenu;
  });

  it('should create and link item and after delete menu', async () => {
    const dbItem = await itemService.create(itemExample);
    await itemService.linkItem(menuExample.id, dbItem.id);

    const result = await menuService.remove(menuExample.id);
    const itemResult = await itemRepository.findOne({
      where: { id: dbItem.id },
      relations: ['menu'],
    });

    expect(result).toEqual({ ...menuExample, id: undefined });
    expect(itemResult.menu).toBeNull();
  });
});
