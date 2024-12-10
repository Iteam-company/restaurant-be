import {
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
import CreateRestaurantDto from 'src/types/dto/create-restaurant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateUpdateRestaurantDto from 'src/types/dto/update-restaurant.dto';
import AdminAccess from 'src/types/AdminAccess';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get(':restaurantId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async getRestaurant(@Param('restaurantId') id: string) {
    return await this.restaurantService.getRestaurant(+id);
  }

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  async createRestaurant(@Request() req, @Body() body: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.createRestaurant(body);

    await this.restaurantService.addWorker(req.user.id, restaurant.id);

    return restaurant;
  }

  @Patch(':restaurantId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUpdateRestaurantDto })
  async updateRestaurant(
    @Body() body: CreateUpdateRestaurantDto,
    @Param('restaurantId') id: string,
  ) {
    return await this.restaurantService.changeRestaurant(+id, body);
  }

  @Delete(':restaurantId')
  @ApiParam({ name: 'restaurantId' })
  @AdminAccess()
  @UseGuards(AuthGuard)
  async deleteRestaurant(@Param('restaurantId') id) {
    return await this.restaurantService.removeRestaurant(+id);
  }
}
