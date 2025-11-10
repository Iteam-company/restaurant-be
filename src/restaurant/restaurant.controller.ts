import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import User from 'src/types/entity/user.entity';
import { CurrentUser } from 'src/types/decorators/current-user.decorator';

@ApiBearerAuth()
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateRestaurantDto })
  @UseImageInterceptor()
  async createRestaurant(
    @Request() req: RequestType,
    @CurrentUser() user: User,
    @Body() body: CreateRestaurantDto,
  ) {
    try {
      const restaurant = await this.restaurantService.createRestaurant(
        body,
        req.imageUrl,
        user,
      );

      if (user.role === 'admin')
        await this.restaurantService.addAdmin(user.id, restaurant.id);

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
  async getAllRestaurants(@CurrentUser() user: User) {
    if (user.role === 'owner')
      return await this.restaurantService.getAllOwnerRestaurants(user.id);
    else if (user.role === 'admin')
      return await this.restaurantService.getAllAdminRestaurant(user.id);

    return await this.restaurantService.getAllWaiterRestaurant(user.id);
  }

  @Get(':restaurantId')
  @UseGuards(AuthGuard)
  async getRestaurant(@Param('restaurantId', ParseIntPipe) id: number) {
    return await this.restaurantService.getRestaurant(+id);
  }

  @Patch(':restaurantId')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUpdateRestaurantDto })
  async updateRestaurant(
    @Body() body: CreateUpdateRestaurantDto,
    @Param('restaurantId', ParseIntPipe) id: number,
  ) {
    return await this.restaurantService.changeRestaurant(+id, body);
  }

  @Patch(':restaurantId/image')
  @UseImageInterceptor()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async updateRestaurantImage(
    @Request() req: RequestType,
    @Param('restaurantId', ParseIntPipe) id: number,
  ) {
    return await this.restaurantService.updateImage(+id, req.imageUrl);
  }

  @Delete(':restaurantId')
  @ApiParam({ name: 'restaurantId' })
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async deleteRestaurant(@Param('restaurantId', ParseIntPipe) id: number) {
    return await this.restaurantService.removeRestaurant(+id);
  }
}
