import { Injectable, NotFoundException } from '@nestjs/common';
import CreateRestaurantDto from 'src/types/dto/create-restaurant.dto';
import CreateUpdateRestaurantDto from 'src/types/dto/create-update-restaurant.dto';
import RestaurantType from 'src/types/RestaurantType';

@Injectable()
export class RestaurantService {
  private restaurants: RestaurantType[] = [
    { id: 1, name: 'TruePrice', address: 'somewhere' },
  ];

  async getRestaurant(id: number) {
    const dbRestaurant = this.restaurants.find((elem) => elem.id === id);
    if (!dbRestaurant)
      throw new NotFoundException('Restaurant with this id is not exist');

    return dbRestaurant;
  }

  async createRestaurant(restaurant: CreateRestaurantDto) {
    return await this.restaurants.push({
      ...restaurant,
      id: this.restaurants.length,
    });
  }

  async changeRestaurant(id: number, restaurant: CreateUpdateRestaurantDto) {
    const dbRestaurantIndex = await this.restaurants.findIndex(
      (elem) => elem.id === id,
    );
    if (dbRestaurantIndex === -1)
      throw new NotFoundException('Restaurant with this id is not exist');

    this.restaurants[dbRestaurantIndex] = {
      ...this.restaurants[dbRestaurantIndex],
      ...restaurant,
    };

    return this.restaurants[dbRestaurantIndex];
  }

  async removeRestaurant(id: number) {
    const dbUserIndex = await this.restaurants.findIndex(
      (elem) => elem.id === id,
    );
    if (dbUserIndex === -1) throw new NotFoundException('Restaurant not found');

    return await this.restaurants.splice(dbUserIndex, 1);
  }
}
