import { PaginateQuery } from 'nestjs-paginate';

class SearchQueryDto implements PaginateQuery {
  limit?: number;
  page?: number;
  search?: string;
  path: string;
}

export default SearchQueryDto;
