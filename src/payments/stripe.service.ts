import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-07-30.basil',
    });
  }

  createCheckoutSession(plan: any, userId: string) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://example.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://example.com/cancel`,
      metadata: {
        userId,
        planId: plan.id,
      },
    });
  }

  getStripeInstance(): Stripe {
    return this.stripe;
  }
}
