import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Body,
  Get,
  HttpCode,
  Res,
  Headers,
  HttpStatus,
  // RawBodyRequest,
} from '@nestjs/common';
// import { Response, Request } from 'express';
import { PaymentsService } from './payments.service';
import { SupabaseAuthGuard } from 'src/supabase/supabase-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Payment } from './entity/payments.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) { }

  @Post('checkout/:planId')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  async checkout(@Req() req, @Param('planId') planId: string) {
    const session = await this.paymentService.createCheckoutSession(req.user.id, planId);
    return { url: session.url };
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  async getUserPayments(@Req() req): Promise<Payment[]> {
    return this.paymentService.getUserPayments(req.user.id);
  }

  @Post('webhooks/stripe')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async handleStripeWebhook(
    @Req() req: Request, // no need to extend req anymore
    // @Req() req: RawBodyRequest<Request>, // no need to extend req anymore
    @Res() res: Response,
    // @Headers('stripe-signature') signature: string,
  ) {
    try {
      // const rawBody = (req as any).body; // Stripe will get the raw body now
      // console.log("rawBody:", rawBody);
      // This above 2 lines is working for localhost webhook logs if we enable this below line 
      // app.use('/payments/webhooks/stripe', express.raw({ type: '*/*' })); // it is perfect for localhost // working
      // in main.ts file

      // now this below is for live production req,ote hosting
      // const rawBody = (req as any).rawBody as Buffer; //now it's truly raw
      // console.log("rawBody:", rawBody);

      // const signature = req.headers['stripe-signature'];
      const signature = req.headers['stripe-signature'] as string;
      // const rawBody = req.rawBody;
      const rawBody = req.body as Buffer;

      await this.paymentService.handleStripeWebhook(rawBody, signature);
      console.log('✅ Webhook handled successfully');
      // return res.send({ received: true });
      return res.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      console.error('❌ Webhook error:', err.message);
      // return res.status(400).send(`Webhook Error: ${err.message}`);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
