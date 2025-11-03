import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './restaurant.entity';
import { QuizResult } from './quiz-result.entity';
import { RefreshTokens } from './refresh-tokens';

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

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.workers)
  workerRestaurants: Restaurant[];

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.admins)
  adminRestaurants: Restaurant[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  ownedRestaurants: Restaurant[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizzes: QuizResult[];

  @OneToMany(() => RefreshTokens, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokens;
}
