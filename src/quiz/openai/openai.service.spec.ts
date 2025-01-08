import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { MenuModule } from 'src/menu/menu.module';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { QuizModule } from '../quiz.module';
import { QuizService } from '../quiz.service';
import { MenuService } from 'src/menu/menu.service';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from '../dto/create-quiz.dto';
import { CreateMenuItemDto } from 'src/menu/item/dto/create-menu-item.dto';
import { ItemModule } from 'src/menu/item/item.module';
import { ItemService } from 'src/menu/item/item.service';
import { UserModule } from 'src/user/user.module';
import { getTestDataSource } from 'test/testDataSource';

describe('OpenaiService', () => {
  jest.setTimeout(15000);

  let service: OpenaiService;
  let quizService: QuizService;
  let menuService: MenuService;
  let menuItemService: ItemService;

  const menuExample: CreateMenuDto = {
    name: 'Question generation',
    categories: CategoriesEnum.DESSERTS,
    season: SeasonsEnum.SUMMER,
  };

  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    menuId: 0,
  };

  const menuItemsExamples: CreateMenuItemDto[] = [
    {
      name: 'Caezar 2',
      description:
        'is a green salad of romaine lettuce and croutons dressed with lemon juice (or lime juice), olive oil, eggs, Worcestershire sauce, anchovies, garlic, Dijon mustard, Parmesan and black pepper.',
      ingredients: `Romaine lettuce
                    olive oil
                    crushed garlic
                    salt
                    Dijon mustard
                    black pepper
                    lemon juice
                    Worcestershire sauce
                    anchovies
                    whole eggs or egg yolks, raw, poached or coddled
                    grated Parmesan cheese
                    croutons`,
      timeForCook: '60 min',
      weight: 700,
      price: 130,
    },
    {
      name: 'Borsch 2',
      description:
        ' is a sour soup, made with meat stock, vegetables and seasonings, common in Eastern Europe and Northern Asia.',
      ingredients: `beetroots, white cabbage, carrots, parsley root, potatoes, onions and tomatoes.`,
      timeForCook: '60 min',
      weight: 700,
      price: 130,
    },
  ];

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
          useFactory: (configService: ConfigService) =>
            getTestDataSource(configService),
        }),
        forwardRef(() => MenuModule),
        UserModule,
        ItemModule,
        QuizModule,
        SharedJwtAuthModule,
      ],
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
    menuService = module.get<MenuService>(MenuService);
    menuItemService = module.get<ItemService>(ItemService);
    quizService = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(menuService).toBeDefined();
    expect(menuItemService).toBeDefined();
    expect(quizService).toBeDefined();
  });

  it('should generate JSON questions', async () => {
    const dbMenu = await menuService.create(menuExample);

    await quizService.create({
      ...quizExample,
      menuId: dbMenu.id,
    });

    for await (const item of menuItemsExamples) {
      const dbMenuItem = await menuItemService.create(item);
      await menuItemService.linkItem(dbMenu.id, dbMenuItem.id);
    }

    const questionsCount = 1;
    const result = await service.getQuestions(dbMenu.id, questionsCount);

    expect(result).toBeDefined();
    expect(result.length).toEqual(questionsCount);
  });
});
