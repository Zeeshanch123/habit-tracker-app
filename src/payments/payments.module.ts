import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '../plans/entity/plans.entity';
import { User } from '../user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Payment } from './entity/payments.entity';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Plan, User]), ConfigModule, SupabaseModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService],
})
export class PaymentsModule { }