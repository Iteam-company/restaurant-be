import CreateRestaurantDto from '../restaurant/dto/create-restaurant.dto';

type RestaurantType = CreateRestaurantDto & {
  id: number;
};

export default RestaurantType;
