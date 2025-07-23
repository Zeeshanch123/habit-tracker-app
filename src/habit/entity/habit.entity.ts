import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { HabitLog } from '../../habit-log/entity/habit-log.entity';
import { Resource } from '../../resource/entity/resource.entity';

@Entity('habits')
export class Habit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 100 })
  frequency: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.habits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HabitLog, habitLog => habitLog.habit)
  habitLogs: HabitLog[];

  @OneToMany(() => Resource, resource => resource.habit)
  resources: Resource[];
} 