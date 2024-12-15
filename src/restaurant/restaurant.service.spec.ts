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

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let userService: UserService;

  let restaurantRepository: Repository<Restaurant>;
  let userRepository: Repository<User>;

  let restaurantExample = {
    id: 0,
    name: 'TruePrice',
    address: 'qwertyuiolkmn bnjkl',
    menu: [],
    workers: [],
  };

  const userPassword = 'qwertyuiop';

  let userExample = {
    id: 1,
    firstName: 'Jim',
    lastName: 'Hatteberg',
    username: 'JH',
    email: 'JHBest@mail.com',
    phoneNumber: '+380970000000',
    role: 'waiter',
    password: userPassword,
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
        TypeOrmModule.forFeature([Restaurant, User]),
        UserModule,
        SharedJwtAuthModule,
      ],
      providers: [RestaurantService],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    userService = module.get<UserService>(UserService);
    restaurantRepository = module.get('RestaurantRepository');
    userRepository = module.get('UserRepository');
  });

  afterAll(() => {
    restaurantRepository.delete({});
    userRepository.delete({});
  });

  it('should be defined', async () => {
    expect(restaurantRepository).toBeDefined();
    expect(restaurantService).toBeDefined();
  });

  it('should create and save a new restaurant', async () => {
    const result = await restaurantService.createRestaurant(<
      CreateRestaurantDto
    >{
      ...restaurantExample,
      id: undefined,
    });

    expect(result).toEqual({
      ...restaurantExample,
      id: result.id,
    });
    restaurantExample = result;
  });

  it('should link worker to restaurant', async () => {
    const worker = await userService.createUser({
      ...userExample,
      role: 'waiter',
    });
    const dbRestaurant = await restaurantService.addWorker(
      worker.id,
      restaurantExample.id,
    );

    expect(dbRestaurant).toEqual({ ...dbRestaurant, workers: [worker] });
    userExample = worker;
  });

  it('should unlink worker from restaurant', async () => {
    const dbRestaurant = await restaurantService.removeWorker(
      userExample.id,
      restaurantExample.id,
    );

    expect(dbRestaurant).toEqual({ ...dbRestaurant, workers: [] });
  });

  it('should add new worker and remove restaurant with worker', async () => {
    const dbRestaurantWithWorker = await restaurantService.addWorker(
      userExample.id,
      restaurantExample.id,
    );

    const dbRestaurant = await restaurantService.removeRestaurant(
      restaurantExample.id,
    );

    expect({
      ...dbRestaurant,
      workers: dbRestaurant.workers.map((elem) => {
        return { ...elem, password: undefined };
      }),
    }).toEqual({ ...dbRestaurantWithWorker, id: undefined });
  });
});
