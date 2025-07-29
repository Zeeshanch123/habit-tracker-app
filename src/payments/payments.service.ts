import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../plans/entity/plans.entity';
import { User } from '../user/entity/user.entity';
import { StripeService } from './stripe.service';
import { Payment } from './entity/payments.entity';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
    private stripeService: StripeService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async createCheckoutSession(userId: string, planId: string) {
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const session = await this.stripeService.createCheckoutSession(plan, userId);

    await this.paymentRepo.save({
      stripe_session_id: session.id,
      amount: plan.price,
      status: 'pending',
      user,
      plan,
    });

    return session;
  }


  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { paid_at: 'DESC' },
    });
  }

  async markPaymentComplete(sessionId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { stripe_session_id: sessionId },
      relations: ['plan', 'user'],
    });

    if (!payment) {
      console.warn('⚠️ Payment not found for session:', sessionId);
      return;
    }

    payment.status = 'completed';
    payment.paid_at = new Date();
    await this.paymentRepo.save(payment);
    console.log('✅ Payment marked completed for:', sessionId);
    // 👇 Insert into Supabase to trigger Realtime
    await this.supabase.from('realtime_payments').insert({
      user_id: payment.user.id,
      session_id: payment.stripe_session_id,
      status: 'completed',
      paid_at: payment.paid_at.toISOString(),
    });
    console.log('Supabase realtime event triggered');
  }


  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const stripe = this.stripeService.getStripeInstance();
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!endpointSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set in environment variables');
      throw new Error('Missing Stripe webhook secret');
    }

    let event: Stripe.Event;

    try {
      
      console.log('📥 Received Stripe webhook');
      console.log('📦 Signature:', signature);
      console.log('🧾 Raw body type:', typeof rawBody);
      console.log('🧾 Raw body preview (300 chars):', rawBody?.toString('utf8')?.slice(0, 300));

      event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
      console.error('❌ Stripe webhook signature verification failed:', err.message);
      throw err;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Checkout session completed:', session.id);
      await this.markPaymentComplete(session.id);
    }

    return { received: true };
  }
}
