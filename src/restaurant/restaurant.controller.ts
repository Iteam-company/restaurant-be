import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateUpdateRestaurantDto from 'src/restaurant/dto/update-restaurant.dto';
import RequestType from 'src/types/RequestType';
import UseImageInterceptor from 'src/types/UseImageInterceptor';
import SearchQueryDto from './dto/search-query.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';

@ApiBearerAuth()
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  @UseImageInterceptor()
  async createRestaurant(@Request() req, @Body() body: CreateRestaurantDto) {
    try {
      const restaurant = await this.restaurantService.createRestaurant(
        body,
        req.imageUrl,
        req.user,
      );

      await this.restaurantService.addWorker(req.user.id, restaurant.id);

      return restaurant;
    } catch (err) {
      if (req.imageUrl)
        await this.restaurantService.removeCloudinaryImage(req.imageUrl);
      throw err;
    }
  }

  @Get('search/')
  @UseGuards(AuthGuard)
  async search(@Query() query: SearchQueryDto) {
    return await this.restaurantService.getSearch(query);
  }

  @Get('parse-owner-admin-waiter/')
  @UseGuards(AuthGuard)
  async getAllRestaurants(@Request() req: RequestType) {
    if (req.user.role === 'owner')
      return await this.restaurantService.getAllOwnerRestaurants(req.user.id);
    else if (req.user.role === 'admin')
      return await this.restaurantService.getAllAdminRestaurant(req.user.id);

    return await this.restaurantService.getAllWaiterRestaurant(req.user.id);
  }

  @Get('/:id/menus')
  @UseGuards(AuthGuard)
  async getMenusFromRestaurant(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.getMenusFromRestaurant(+id);
  }

  @Get(':restaurantId')
  @UseGuards(AuthGuard)
  async getRestaurant(@Param('restaurantId') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.getRestaurant(+id);
  }

  @Patch(':restaurantId')
  @AdminOwnerAccess()
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
  @AdminOwnerAccess()
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
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async deleteRestaurant(@Param('restaurantId') id) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.restaurantService.removeRestaurant(+id);
  }
}
