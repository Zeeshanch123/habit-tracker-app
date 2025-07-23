import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Habit } from '../../habit/entity/habit.entity';
import { HabitLog } from '../../habit-log/entity/habit-log.entity';
import { Payment } from '../../payments/entity/payments.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string; // Supabase Auth user ID

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Habit, habit => habit.user)
  habits: Habit[];

  @OneToMany(() => HabitLog, habitLog => habitLog.user)
  habitLogs: HabitLog[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];
}