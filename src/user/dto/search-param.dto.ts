import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';

class SearchQueryDto implements PaginateQuery {
  @ApiProperty({ description: 'Limit on one page' })
  limit?: number;
  @ApiProperty({ description: 'Page number' })
  page?: number;
  @ApiProperty({ description: 'Search by name or address of restaurant' })
  search?: string;
  @ApiProperty({ description: 'Search by restaurant' })
  restaurantId?: number;
  path: string;
}

export default SearchQueryDto;
