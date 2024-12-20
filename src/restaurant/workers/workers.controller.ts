import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import AdminAccess from 'src/types/AdminAccess';
import CreateWorkerDto from 'src/restaurant/workers/dto/create-worker.dto';
import { RestaurantService } from '../restaurant.service';
import DeleteWorkerDto from './dto/delete-worker.dto';

@Controller('restaurant/workers')
export class WorkersController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateWorkerDto })
  async addWorker(@Body() body: CreateWorkerDto) {
    return await this.restaurantService.addWorker(
      body.userId,
      body.restaurantId,
    );
  }

  @Delete()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: DeleteWorkerDto })
  async removeWorker(@Body() body: DeleteWorkerDto) {
    return await this.restaurantService.removeWorker(
      body.userId,
      body.restaurantId,
    );
  }
}
