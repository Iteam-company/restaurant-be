import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MenuLinkService } from './menu-link.service';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('restourant/menu')
export class MenuLinkController {
  constructor(private readonly menuLinkService: MenuLinkService) {}

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

    return await this.menuLinkService.linkMenuToRestaurant(
      +menuId,
      +restaurantId,
    );
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

    return await this.menuLinkService.unlinkMenuFromRestaurant(
      +menuId,
      +restaurantId,
    );
  }
}
