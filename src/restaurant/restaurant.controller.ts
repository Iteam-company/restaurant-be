import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateUpdateRestaurantDto from 'src/restaurant/dto/update-restaurant.dto';
import AdminAccess from 'src/types/AdminAccess';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  async createRestaurant(@Request() req, @Body() body: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.createRestaurant(body);

    await this.restaurantService.addWorker(req.user.id, restaurant.id);

    return restaurant;
  }

  @Get(':restaurantId')
  @UseGuards(AuthGuard)
  async getRestaurant(@Param('restaurantId') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.getRestaurant(+id);
  }

  @Patch(':restaurantId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUpdateRestaurantDto })
  async updateRestaurant(
    @Body() body: CreateUpdateRestaurantDto,
    @Param('restaurantId') id: string,
  ) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.changeRestaurant(+id, body);
  }

  @Delete(':restaurantId')
  @ApiParam({ name: 'restaurantId' })
  @AdminAccess()
  @UseGuards(AuthGuard)
  async deleteRestaurant(@Param('restaurantId') id) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.removeRestaurant(+id);
  }
}
