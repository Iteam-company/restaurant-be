import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => User, (user) => user.restaurant)
  workers: User[];

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menu: Menu[];
}
