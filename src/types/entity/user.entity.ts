import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './restaurant.entity';
import { QuizResult } from './quiz-result.entity';

export enum UserRole {
  OWNER = 'owner',
  WAITER = 'waiter',
  ADMIN = 'admin',
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column({ enum: [UserRole] })
  role: UserRole;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.workers)
  restaurant: Restaurant;

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizes: QuizResult[];
}
