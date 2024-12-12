import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('restaurant/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post(':restaurantId/:menuId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async link(
    @Param('menuId') menuId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+restaurantId))
      throw new BadRequestException(
        `Param restaurantId: ${restaurantId} is not a number`,
      );

    return await this.menuService.linkMenuToRestaurant(+menuId, +restaurantId);
  }

  @Delete(':restaurantId/:menuId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async unlink(
    @Param('menuId') menuId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+restaurantId))
      throw new BadRequestException(
        `Param restaurantId: ${restaurantId} is not a number`,
      );

    return await this.menuService.unlinkMenuFromRestaurant(
      +menuId,
      +restaurantId,
    );
  }
}
