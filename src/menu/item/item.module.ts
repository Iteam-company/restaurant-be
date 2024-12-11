import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import MenuItem from 'src/types/entity/menu-item.entity';
import Menu from 'src/types/entity/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuItem])],
  exports: [ItemService],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
