import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import AdminAccess from 'src/types/AdminAccess';
import CreateWorkerDto from 'src/types/dto/create-worker.dto';
import DeleteWorkerDto from 'src/types/dto/delete-worker.dto';
import { RestaurantService } from '../restaurant.service';

@Controller('restaurant/workers')
export class WorkersController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Patch()
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
