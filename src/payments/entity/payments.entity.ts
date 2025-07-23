import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Check, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Plan } from '../../plans/entity/plans.entity';

@Check(`"amount" > 0`)
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  stripe_session_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 100, default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Plan, plan => plan.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
} 