import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { QuizResult } from './quiz-result.entity';
import Restaurant from './restaurant.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: Question[];

  @Column({ enum: ['easy', 'medium', 'hard'] })
  difficultyLevel: 'easy' | 'medium' | 'hard';

  @Column()
  timeLimit: number;

  @Column({ enum: ['in-progress', 'completed', 'not-started'] })
  status: 'in-progress' | 'completed' | 'not-started';

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.quizzes, {
    cascade: true,
  })
  restaurants: Restaurant[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz, {
    cascade: true,
  })
  quizResults: QuizResult[];
}
