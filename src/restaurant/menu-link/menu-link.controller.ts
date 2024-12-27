import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MenuLinkService } from './menu-link.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';

@ApiBearerAuth()
@Controller('restaurant/menu')
export class MenuLinkController {
  constructor(private readonly menuLinkService: MenuLinkService) {}

  @Post(':restaurantId/:menuId')
  @AdminOwnerAccess()
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
  @AdminOwnerAccess()
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
