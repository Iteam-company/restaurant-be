import { Test, TestingModule } from '@nestjs/testing';
import { MenuLinkService } from './menu-link.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { RestaurantModule } from '../restaurant.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantService } from '../restaurant.service';
import { Repository } from 'typeorm';
import { MenuService } from 'src/menu/menu.service';
import { MenuModule } from 'src/menu/menu.module';
import { CreateMenuDto } from 'src/menu/dto/create-menu.dto';

describe('MenuLinkService', () => {
  let restaurantService: RestaurantService;
  let menuLinkService: MenuLinkService;
  let menuService: MenuService;

  let restaurantRepository: Repository<Restaurant>;
  let menuRepository: Repository<Menu>;

  let restaurantExample = {
    id: 0,
    name: 'Puzatka',
    address: 'qwertyuiolkmn',
    menu: [],
    workers: [],
  };

  let menuExample = {
    id: 0,
    name: 'Cesar',
    season: 'winter',
    categories: 'main courses',
  };

  beforeEach(async () => {
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
        TypeOrmModule.forFeature([Restaurant, Menu]),
        MenuModule,
        RestaurantModule,
        SharedJwtAuthModule,
      ],
      providers: [MenuLinkService],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    menuLinkService = module.get<MenuLinkService>(MenuLinkService);
    menuService = module.get<MenuService>(MenuService);

    restaurantRepository = module.get('RestaurantRepository');
    menuRepository = module.get('MenuRepository');
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
    expect(restaurantRepository).toBeDefined();
    expect(menuLinkService).toBeDefined();
    expect(menuRepository).toBeDefined();
  });

  it('should create restaurant and menu', async () => {
    const dbRestaurant =
      await restaurantService.createRestaurant(restaurantExample);
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);

    expect(dbRestaurant).toBeDefined();
    expect(dbMenu).toBeDefined();

    restaurantExample = dbRestaurant;
    menuExample = dbMenu;
  });

  it('should link menu to restaurant', async () => {
    const dbRestaurantWithMenu = await menuLinkService.linkMenuToRestaurant(
      menuExample.id,
      restaurantExample.id,
    );

    expect({ ...dbRestaurantWithMenu }).toEqual({
      ...restaurantExample,
      menu: [<Menu>menuExample],
    });
  });

  it('should unlink menu from restaurant', async () => {
    const dbMenu = await menuLinkService.unlinkMenuFromRestaurant(
      menuExample.id,
      restaurantExample.id,
    );

    expect({ ...dbMenu }).toEqual({
      ...menuExample,
      restaurant: null,
    });
  });
});
