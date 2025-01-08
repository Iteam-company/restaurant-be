import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';

class SearchItemQueryDto implements PaginateQuery {
  @ApiProperty({ description: 'Limit on one page', required: false })
  limit?: number;
  @ApiProperty({ description: 'Page number', required: false })
  page?: number;
  @ApiProperty({
    description: 'Search by name or address of restaurant',
    required: false,
  })
  search?: string;
  @ApiProperty({ description: 'Search by menuId', required: false })
  menuId?: string;
  @ApiProperty({ description: 'Search by restaurantId', required: false })
  restaurantId?: string;
  path: string;
}

export default SearchItemQueryDto;
