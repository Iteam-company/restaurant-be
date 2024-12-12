import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Menu from 'src/types/entity/menu.entity';
import Restaurant from 'src/types/entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Restaurant])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
