import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Menu from 'src/types/entity/menu.entity';
import { MenuService } from './menu.service';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from './dto/create-menu.dto';
import { QuizModule } from 'src/quiz/quiz.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { getTestDataSource } from 'test/testDataSource';

describe('MenuService', () => {
  let menuService: MenuService;

  const menuExample: CreateMenuDto = {
    name: 'Summer hits',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.SUMMER,
  };

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
          useFactory: (configService: ConfigService) =>
            getTestDataSource(configService),
        }),
        TypeOrmModule.forFeature([Menu]),
        QuizModule,
        SharedJwtAuthModule,
      ],
      providers: [MenuService],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
  });

  it('should be defined', async () => {
    expect(menuService).toBeDefined();
  });

  it('should create and save a new menu', async () => {
    const result = await menuService.create(<CreateMenuDto>{
      ...menuExample,
    });

    expect(result).toEqual({
      ...menuExample,
      id: result.id,
    });
    menuResource = await menuService.findOne(result.id);
  });

  it('should update and save existing menu', async () => {
    const updateData = {
      name: 'Winter hits',
      season: SeasonsEnum.WINTER,
    };
    const result = await menuService.update(
      menuResource.id,
      <UpdateMenuDto>updateData,
    );

    expect({
      ...result,
    }).toEqual({ ...menuResource, ...updateData });

    menuResource = { ...menuResource, ...updateData };
  });

  it('should remove existing menu', async () => {
    const result = await menuService.remove(menuResource.id);

    expect(result).toEqual({ ...menuResource, id: undefined });
  });
});
