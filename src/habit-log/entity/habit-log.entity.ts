import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Habit } from '../../habit/entity/habit.entity';

@Entity('habit_logs')
export class HabitLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  completed_on: string;

  @Column('text')
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.habitLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Habit, habit => habit.habitLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;
}