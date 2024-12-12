import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from './item/item.module';
import Menu from 'src/types/entity/menu.entity';
import { QuizModule } from 'src/quiz/quiz.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    ItemModule,
    forwardRef(() => QuizModule),
  ],
  exports: [MenuService],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
