import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Quiz, (quiz) => quiz.restaurant, { onDelete: 'CASCADE' })
  quizzes: Quiz[];

  @OneToMany(() => User, (user) => user.restaurant, { onDelete: 'CASCADE' })
  workers: User[];

  @OneToMany(() => User, (user) => user.restaurant, { onDelete: 'CASCADE' })
  admins: User[];

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  owner: User;
}
