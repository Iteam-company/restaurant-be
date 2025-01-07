import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Menu from './menu.entity';

@Entity()
export default class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  ingredients: string;

  @Column()
  timeForCook: string;

  @Column()
  weight: number;

  @Column('float')
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Menu, (menu) => menu.menuItems, { onDelete: 'CASCADE' })
  menu: Menu;
}
