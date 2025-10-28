import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import { Quiz } from './quiz.entity';

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

  @ManyToMany(() => Quiz, (quiz) => quiz.restaurants, { onDelete: 'CASCADE' })
  @JoinTable()
  quizzes: Quiz[];

  @ManyToMany(() => User, (user) => user.workerRestaurants, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'restaurant_workers',
    joinColumn: { name: 'restaurant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  workers: User[];

  @ManyToMany(() => User, (user) => user.adminRestaurants, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'restaurant_admins',
    joinColumn: { name: 'restaurant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  admins: User[];

  @ManyToOne(() => User, (user) => user.ownedRestaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;
}
