import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from './item/item.module';
import Menu from 'src/types/entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), ItemModule],
  exports: [MenuService],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
