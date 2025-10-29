import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import Restaurant from 'src/types/entity/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import CreateRestaurantDto from './dto/create-restaurant.dto';
import User, { UserRole } from 'src/types/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { UserService } from 'src/user/user.service';
import PayloadType from 'src/types/PayloadType';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { TestDataSource } from 'src/test-data-source';
import { QuizModule } from 'src/quiz/quiz.module';
import { EventsModule } from 'src/events/events.module';

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
    role: UserRole.WAITER,
    password: 'qwertyuiop',
  };

  const ownerExample: CreateUserDto = {
    firstName: 'qq',
    lastName: 'asd',
    username: 'fgh',
    email: 'asd@mail.com',
    phoneNumber: '+380970000007',
    role: UserRole.OWNER,
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
        TypeOrmModule.forRoot(TestDataSource.options),
        TypeOrmModule.forFeature([Restaurant]),
        UserModule,
        SharedJwtAuthModule,
        QuizModule,
        EventsModule,
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
          role: UserRole.OWNER,
        })
      ).access_token,
    );
    const result = await restaurantService.createRestaurant(
      <CreateRestaurantDto>{
        ...restaurantExample,
        id: undefined,
        ownerId: userPayload.id,
      },
      undefined,
      {
        role: 'admin',
        id: userPayload.id,
        username: '',
        email: '',
        icon: null,
      },
    );

    expect({
      ...result,
      admins: undefined,
    }).toEqual({
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
          role: UserRole.WAITER,
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
      admins: undefined,
      quizzes: undefined,
    }).toEqual({ ...dbRestaurantWithWorker, id: undefined });
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
