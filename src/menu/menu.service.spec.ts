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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { QuizModule } from 'src/quiz/quiz.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { UpdateMenuDto } from './dto/update-menu.dto';

describe('MenuService', () => {
  let menuService: MenuService;

  let menuRepository: Repository<Menu>;

  let menuExample = {
    id: 0,
    name: 'Summer hits',
    categories: 'main courses',
    season: 'summer',
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
        TypeOrmModule.forFeature([Menu]),
        QuizModule,
        SharedJwtAuthModule,
      ],
      providers: [MenuService],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
    menuRepository = module.get('MenuRepository');
  });

  it('should be defined', async () => {
    expect(menuService).toBeDefined();
    expect(menuRepository).toBeDefined();
  });

  it('should create and save a new menu', async () => {
    const result = await menuService.create(<CreateMenuDto>{
      ...menuExample,
    });

    expect(result).toEqual({
      ...menuExample,
      id: result.id,
    });
    menuExample = result;
  });

  it('should update and save existing menu', async () => {
    const updateData = {
      name: 'Winter hits',
      season: 'winter',
    };
    const result = await menuService.update(
      menuExample.id,
      <UpdateMenuDto>updateData,
    );

    expect(result).toEqual({ ...menuExample, ...updateData });

    menuExample = { ...menuExample, ...updateData };
  });

  it('should remove existing menu', async () => {
    const result = await menuService.remove(menuExample.id);

    expect(result).toEqual({ ...menuExample, id: undefined });
  });
});
