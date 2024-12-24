import {
  BadRequestException,
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
import { ApiBody, ApiParam } from '@nestjs/swagger';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateUpdateRestaurantDto from 'src/restaurant/dto/update-restaurant.dto';
import AdminAccess from 'src/types/AdminAccess';
import RequestType from 'src/types/RequestType';
import UseImageInterceptor from 'src/types/UseImageInterceptor';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  @UseImageInterceptor()
  async createRestaurant(@Request() req, @Body() body: CreateRestaurantDto) {
    try {
      const restaurant = await this.restaurantService.createRestaurant(
        body,
        req.imageUrl,
      );

      await this.restaurantService.addWorker(req.user.id, restaurant.id);

      return restaurant;
    } catch (err) {
      if (req.imageUrl)
        await this.restaurantService.removeCloudinaryImage(req.imageUrl);
      throw err;
    }
  }

  @Get('owner-by/')
  @UseGuards(AuthGuard)
  async getAllRestaurants(@Request() req: RequestType) {
    if (req.user.role !== 'owner')
      throw new ForbiddenException('This user is not a owner');

    return await this.restaurantService.getAllOwnerRestaurants(req.user.id);
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

  @Patch(':restaurantId/image')
  @UseImageInterceptor()
  @AdminAccess()
  @UseGuards(AuthGuard)
  async updateRestaurantImage(
    @Request() req: RequestType,
    @Param('restaurantId') id: string,
  ) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.updateImage(+id, req.imageUrl);
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
