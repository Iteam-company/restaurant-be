import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';
import { ItemService } from './item/item.service';

@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateMenuDto })
  async create(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.create(createMenuDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.menuService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.menuService.findOne(+id);
  }

  @Patch(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateMenuDto })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.menuService.remove(+id);
  }

  @Post(':menuId/:itemId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async addItem(
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+itemId))
      throw new BadRequestException(`Param menuId: ${itemId} is not a number`);

    return await this.itemService.linkItem(+menuId, +itemId);
  }

  @Delete(':menuId/:itemId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async removeItem(
    @Param('menuId') menuId: string,
    @Param('itemId') itemId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+itemId))
      throw new BadRequestException(`Param menuId: ${itemId} is not a number`);

    return await this.itemService.unlinkItem(+menuId, +itemId);
  }
}
