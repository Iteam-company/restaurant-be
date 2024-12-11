import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiBody } from '@nestjs/swagger';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('menu/item')
export class ItemController {
  constructor(private readonly menuItemService: ItemService) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateMenuItemDto })
  async create(@Body() body: CreateMenuItemDto) {
    return await this.menuItemService.create(body);
  }

  @Get(':itemId')
  async findMenu(@Param('itemId') menuId: string) {
    return await this.menuItemService.getMenu(+menuId);
  }

  @Patch(':itemId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateMenuItemDto })
  async change(
    @Param('itemId') itemId: string,
    @Body() body: UpdateMenuItemDto,
  ) {
    return await this.menuItemService.changeItem(+itemId, body);
  }

  @Delete(':itemId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('itemId') itemId: string) {
    return await this.menuItemService.remove(+itemId);
  }
}