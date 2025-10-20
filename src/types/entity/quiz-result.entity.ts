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
  ratingDate: Date;

  @ManyToOne(() => User, (user) => user.quizzes, { eager: true })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizResults, {
    eager: true,
    onDelete: 'CASCADE',
  })
  quiz: Quiz;
}
