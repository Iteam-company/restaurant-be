import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { ApiBody } from '@nestjs/swagger';
import RequestType from 'src/types/RequestType';
import CreateRestaurantDto from 'src/types/dto/create-restaurant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateUpdateRestaurantDto from 'src/types/dto/create-update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  private async checkAccess(user) {
    if (user.role !== 'admin') throw new ForbiddenException('No access');
  }

  @Get(':restaurantId')
  @UseGuards(AuthGuard)
  async getRestaurant(@Request() req, @Param('restaurantId') id: string) {
    await this.checkAccess(req.user);

    return await this.restaurantService.getRestaurant(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  async createRestaurant(
    @Request() req: RequestType,
    @Body() body: CreateRestaurantDto,
  ) {
    await this.checkAccess(req.user);

    return await this.restaurantService.createRestaurant(body);
  }

  @Patch(':restaurantId')
  @UseGuards(AuthGuard)
  async updateRestaurant(
    @Request() req: RequestType,
    @Body() body: CreateUpdateRestaurantDto,
    @Param('restaurantId') id: string,
  ) {
    await this.checkAccess(req.user);

    return await this.restaurantService.changeRestaurant(+id, body);
  }

  @Delete(':restaurantId')
  @UseGuards(AuthGuard)
  async deleteRestaurant(
    @Request() req: RequestType,
    @Param('restaurantId') id,
  ) {
    await this.checkAccess(req.user);

    return await this.restaurantService.removeRestaurant(+id);
  }
}
