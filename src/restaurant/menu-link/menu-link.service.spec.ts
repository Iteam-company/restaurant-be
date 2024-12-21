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
import { MenuService } from 'src/menu/menu.service';
import { MenuModule } from 'src/menu/menu.module';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import { forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import CreateUserDto from 'src/user/dto/create-user.dto';
import PayloadType from 'src/types/PayloadType';
import CreateRestaurantDto from '../dto/create-restaurant.dto';

describe('MenuLinkService', () => {
  let restaurantService: RestaurantService;
  let menuLinkService: MenuLinkService;
  let menuService: MenuService;
  let userService: UserService;

  const restaurantExample: CreateRestaurantDto = {
    name: 'Puzatka',
    address: 'qwertyuiolkmn',
    ownerId: 0,
  };

  const menuExample: CreateMenuDto = {
    name: 'Cesar',
    season: SeasonsEnum.WINTER,
    categories: CategoriesEnum.MAIN_COURSES,
  };

  const ownerExample: CreateUserDto = {
    firstName: 'ww',
    lastName: 'asd',
    username: 'vbn',
    email: 'vbn@mail.com',
    phoneNumber: '+380970000008',
    role: 'owner',
    password: 'qwertyuiop',
  };

  let restarauntResource: Restaurant;
  let menuResource: Menu;
  let ownerResource: User;

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
        forwardRef(() => SharedJwtAuthModule),
      ],
      providers: [MenuLinkService],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    menuLinkService = module.get<MenuLinkService>(MenuLinkService);
    menuService = module.get<MenuService>(MenuService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
    expect(menuLinkService).toBeDefined();
    expect(menuService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should create restaurant and menu', async () => {
    const payloadUser = await parseJwt(
      (
        await userService.createUser(<CreateUserDto>{
          ...ownerExample,
          id: undefined,
        })
      ).access_token,
    );
    const dbRestaurant = await restaurantService.createRestaurant({
      ...restaurantExample,
      ownerId: payloadUser.id,
    });
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);

    expect(dbRestaurant).toBeDefined();
    expect(dbMenu).toBeDefined();

    restarauntResource = dbRestaurant;
    menuResource = dbMenu;
    ownerResource = await userService.getUserById(payloadUser.id);
  });

  it('should link menu to restaurant', async () => {
    const dbRestaurantWithMenu = await menuLinkService.linkMenuToRestaurant(
      menuResource.id,
      restarauntResource.id,
    );

    expect({
      ...dbRestaurantWithMenu,
      owner: ownerResource,
      ownerId: ownerResource.id,
      workers: undefined,
    }).toEqual({
      ...restarauntResource,
      menu: [<Menu>menuResource],
    });
  });

  it('should unlink menu from restaurant', async () => {
    const dbMenu = await menuLinkService.unlinkMenuFromRestaurant(
      menuResource.id,
      restarauntResource.id,
    );

    expect({ ...dbMenu }).toEqual({
      ...menuResource,
      restaurant: null,
    });
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
