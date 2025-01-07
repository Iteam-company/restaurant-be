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
import { ItemService } from './item.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import UseDishIconInterceptor from 'src/types/UseDishIconInterceptor';
import RequestType from 'src/types/RequestType';
import SearchItemQueryDto from './dto/search-item.dto';

@ApiBearerAuth()
@Controller('menu/item')
export class ItemController {
  constructor(private readonly menuItemService: ItemService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateMenuItemDto })
  async create(@Body() body: CreateMenuItemDto) {
    return await this.menuItemService.create(body);
  }

  @Get('search/')
  @UseGuards(AuthGuard)
  async findItems(@Query() query: SearchItemQueryDto) {
    return await this.menuItemService.search(query);
  }

  @Get(':itemId')
  @UseGuards(AuthGuard)
  async findMenu(@Param('itemId') menuId: string) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param itemId: ${menuId} is not a number`);

    return await this.menuItemService.getMenuItem(+menuId);
  }

  @Patch(':itemId/image')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @UseDishIconInterceptor()
  async patchIcon(
    @Request() req: RequestType,
    @Param('itemId') itemId: string,
  ) {
    if (Number.isNaN(+itemId))
      throw new BadRequestException(`Param itemId: ${itemId} is not a number`);

    return await this.menuItemService.patchIcon(+itemId, req.imageUrl);
  }

  @Patch(':itemId')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateMenuItemDto })
  async change(
    @Param('itemId') itemId: string,
    @Body() body: UpdateMenuItemDto,
  ) {
    if (Number.isNaN(+itemId))
      throw new BadRequestException(`Param itemId: ${itemId} is not a number`);

    return await this.menuItemService.changeItem(+itemId, body);
  }

  @Delete(':itemId')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('itemId') itemId: string) {
    if (Number.isNaN(+itemId))
      throw new BadRequestException(`Param itemId: ${itemId} is not a number`);

    return await this.menuItemService.remove(+itemId);
  }
}
