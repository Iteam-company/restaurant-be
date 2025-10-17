import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PaginateQuery } from 'nestjs-paginate';

class SearchQueryDto implements PaginateQuery {
  @ApiProperty({ description: 'Limit on one page', required: false })
  limit?: number;
  @ApiProperty({ description: 'Page number', required: false })
  page?: number;
  @ApiProperty({
    description: 'Search by name or address of restaurant',
    required: false,
  })
  search?: string;
  @ApiProperty({ description: 'Search by restaurant', required: false })
  @IsNumber()
  restaurantId?: number;

  path: string;
}

export default SearchQueryDto;
