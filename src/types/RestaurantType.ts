import CreateRestaurantDto from './dto/create-restaurant.dto';

type RestaurantType = CreateRestaurantDto & {
  id: number;
};

export default RestaurantType;
