import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Habit } from '../../habit/entity/habit.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  type: string;

  @Column('text')
  url: string;

  @Column({ length: 100 })
  title: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @ManyToOne(() => Habit, habit => habit.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;
} 