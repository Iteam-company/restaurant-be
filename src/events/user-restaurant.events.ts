import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole } from 'src/types/entity/user.entity';

@Injectable()
export class UserRestaurantEvents {
  constructor(private eventEmitter: EventEmitter2) {}

  async emitUserRoleChange(
    userId: number,
    restaurantId: number,
    newRole: UserRole,
  ) {
    await this.eventEmitter.emit('user.role.change', {
      userId,
      restaurantId,
      newRole,
    });
  }
}
