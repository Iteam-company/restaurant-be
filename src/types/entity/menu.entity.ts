import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MenuItem from './menu-item.entity';
import Restaurant from './restaurant.entity';

@Entity()
export default class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ enum: ['appetizers', 'main courses', 'desserts'] })
  categories: 'appetizers' | 'main courses' | 'desserts';

  @Column({ enum: ['spring', 'summer', 'fall', 'winter'] })
  season: 'spring' | 'summer' | 'fall' | 'winter';

  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu)
  menuItems: MenuItem[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu)
  restaurant: Restaurant;
}
