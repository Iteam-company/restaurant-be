import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: string;

  @CreateDateColumn()
  raitingDate: Date;

  @ManyToOne(() => User, (user) => user.quizes, { eager: true })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizResults, { eager: true })
  quiz: Quiz;
}
