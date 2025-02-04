import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';

class SearchQueryDto implements PaginateQuery {
  @ApiProperty({ description: 'Limit on one page', required: false })
  limit?: number;
  @ApiProperty({ description: 'Page number', required: false })
  page?: number;
  @ApiProperty({
    description: 'Search by user name or quiz name',
    required: false,
  })
  search?: string;
  @ApiProperty({ description: 'Search by restaurant', required: false })
  restaurantId?: number;
  path: string;
}

export default SearchQueryDto;
