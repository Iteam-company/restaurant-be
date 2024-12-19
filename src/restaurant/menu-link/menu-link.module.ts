import { Module } from '@nestjs/common';
import { MenuLinkService } from './menu-link.service';
import { MenuLinkController } from './menu-link.controller';
import Menu from 'src/types/entity/menu.entity';
import Restaurant from 'src/types/entity/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Restaurant])],
  controllers: [MenuLinkController],
  providers: [MenuLinkService],
})
export class MenuLinkModule {}
