import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import CreateWorkerDto from 'src/restaurant/workers/dto/create-worker.dto';
import { RestaurantService } from '../restaurant.service';
import DeleteWorkerDto from './dto/delete-worker.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';

@ApiBearerAuth()
@Controller('restaurant/workers')
export class WorkersController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateWorkerDto })
  async addWorker(@Body() body: CreateWorkerDto) {
    return await this.restaurantService.addWorker(
      body.userId,
      body.restaurantId,
    );
  }

  @Delete(':restaurantId/:userId')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: DeleteWorkerDto })
  async removeWorker(
    @Param('restaurantId') restaurantId: string,
    @Param('userId') userId: string,
  ) {
    if (Number.isNaN(+restaurantId))
      throw new BadRequestException(
        `Param id: ${restaurantId} is not a number`,
      );
    if (Number.isNaN(+userId))
      throw new BadRequestException(`Param id: ${userId} is not a number`);

    return await this.restaurantService.removeWorker(+userId, +restaurantId);
  }
}
