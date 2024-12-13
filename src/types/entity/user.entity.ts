import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './restaurant.entity';
import { QuizResult } from './quiz-result.entity';

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

  @Column({ enum: ['owner', 'waiter', 'admin'] })
  role: 'owner' | 'waiter' | 'admin';

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.workers)
  restaurant: Restaurant;

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizes: QuizResult[];
}
