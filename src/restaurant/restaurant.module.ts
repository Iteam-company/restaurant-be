import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Restaurant from 'src/types/entity/restaurant.entity';
import { UserModule } from 'src/user/user.module';
import { MenuLinkModule } from './menu-link/menu-link.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), UserModule, MenuLinkModule],
  exports: [RestaurantService],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
