import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Menu from './menu.entity';

@Entity()
export default class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => User, (user) => user.restaurant, { onDelete: 'CASCADE' })
  workers: User[];

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menu: Menu[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  owner: User;
}
