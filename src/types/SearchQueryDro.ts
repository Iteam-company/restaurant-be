import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';

class SearchQueryDto implements PaginateQuery {
  @ApiProperty({ description: 'Limit on one page', required: false })
  limit?: number;
  @ApiProperty({ description: 'Page number', required: false })
  page?: number;
  @ApiProperty({
    description: 'Search by fields',
    required: false,
  })
  search?: string;

  path: string;
}

export default SearchQueryDto;
