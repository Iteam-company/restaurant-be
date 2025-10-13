import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { QuizResult } from './quiz-result.entity';

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

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz, {
    cascade: true,
  })
  quizResults: QuizResult[];
}
