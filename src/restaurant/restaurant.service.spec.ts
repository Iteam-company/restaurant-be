import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { RestaurantService } from './restaurant.service';
import CreateRestaurantDto from './dto/create-restaurant.dto';
import User from 'src/types/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { UserService } from 'src/user/user.service';
import PayloadType from 'src/types/PayloadType';
import { forwardRef } from '@nestjs/common';
import CreateUserDto from 'src/user/dto/create-user.dto';

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let userService: UserService;

  let restaurantRepository: Repository<Restaurant>;

  const restaurantExample: CreateRestaurantDto = {
    name: 'TruePrice',
    address: 'qwertyuiolkmn bnjkl',
    ownerId: 0,
  };

  const userExample: CreateUserDto = {
    firstName: 'Jim',
    lastName: 'Hatteberg',
    username: 'JH',
    email: 'JHBest@mail.com',
    phoneNumber: '+380970000000',
    role: 'waiter',
    password: 'qwertyuiop',
  };

  const ownerExample: CreateUserDto = {
    firstName: 'qq',
    lastName: 'asd',
    username: 'fgh',
    email: 'asd@mail.com',
    phoneNumber: '+380970000007',
    role: 'owner',
    password: 'qwertyuiop',
  };

  let restaurantResource: Restaurant;
  let userResource: User;

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
        TypeOrmModule.forFeature([Restaurant, User]),
        forwardRef(() => UserModule),
        SharedJwtAuthModule,
      ],
      providers: [RestaurantService],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    userService = module.get<UserService>(UserService);
    restaurantRepository = module.get('RestaurantRepository');
  });

  it('should be defined', async () => {
    expect(restaurantRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(restaurantService).toBeDefined();
  });

  it('should create and save a new restaurant', async () => {
    const userPayload = await parseJwt(
      (
        await userService.createUser({
          ...ownerExample,
          role: 'owner',
        })
      ).access_token,
    );
    const result = await restaurantService.createRestaurant(<
      CreateRestaurantDto
    >{
      ...restaurantExample,
      id: undefined,
      ownerId: userPayload.id,
    });

    expect(result).toEqual({
      ...restaurantExample,
      id: result.id,
      image: null,
      owner: await userService.getUserById(userPayload.id),
      ownerId: userPayload.id,
    });

    restaurantResource = result;
  });

  it('should link worker to restaurant', async () => {
    const userPayload = await parseJwt(
      (
        await userService.createUser({
          ...userExample,
          role: 'waiter',
        })
      ).access_token,
    );
    const worker = await userService.getUserById(userPayload.id);
    const dbRestaurant = await restaurantService.addWorker(
      worker.id,
      restaurantResource.id,
    );

    expect(dbRestaurant).toEqual({ ...dbRestaurant, workers: [worker] });
    userResource = worker;
  });

  it('should unlink worker from restaurant', async () => {
    const dbRestaurant = await restaurantService.removeWorker(
      userResource.id,
      restaurantResource.id,
    );

    expect(dbRestaurant).toEqual({ ...dbRestaurant, workers: [] });
  });

  it('should add new worker and remove restaurant with worker', async () => {
    const dbRestaurantWithWorker = await restaurantService.addWorker(
      userResource.id,
      restaurantResource.id,
    );

    const dbRestaurant = await restaurantService.removeRestaurant(
      restaurantResource.id,
    );

    expect({
      ...dbRestaurant,
      workers: dbRestaurant.workers.map((elem) => {
        return { ...elem, password: undefined };
      }),
    }).toEqual({ ...dbRestaurantWithWorker, id: undefined });
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
