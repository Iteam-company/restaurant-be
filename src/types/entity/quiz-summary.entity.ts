import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import User from './user.entity';

@Entity()
export class QuizSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bestScore: string;

  @Column()
  endDate: Date;

  @Column()
  duration: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @OneToOne(() => Quiz)
  @JoinColumn()
  quiz: Quiz;
}
