import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import Menu from './menu.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  numberOfQuestions: number;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @Column({ enum: ['easy', 'medium', 'hard'] })
  difficultyLevel: 'easy' | 'medium' | 'hard';

  @Column()
  timeLimit: number;

  @Column({ enum: ['in-progress', 'completed', 'not-started'] })
  status: 'in-progress' | 'completed' | 'not-started';

  @ManyToOne(() => Menu, (menu) => menu.quizes)
  menu: Menu;
}