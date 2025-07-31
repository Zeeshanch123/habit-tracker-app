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
  Logger,
  RawBodyRequest,
  RawBody,
  // RawBodyRequest,
} from '@nestjs/common';
// import { Response, Request } from 'express';
import { PaymentsService } from './payments.service';
import { SupabaseAuthGuard } from 'src/supabase/supabase-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Payment } from './entity/payments.entity';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Request as ExRequest } from 'express';
@Controller('payments')
export class PaymentsController {
  // private readonly logger = new Logger(PaymentsController.name);
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
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
    // @RawBody() rawBody: Buffer
    // @Req() req: Request & { body: Buffer },
  ) {
    try {
      // const rawBody = (req as any).body; // Stripe will get the raw body now
      // console.log("rawBody:", rawBody);
      // // This above 2 lines is working for localhost webhook logs if we enable this below line 
      // // app.use('/payments/webhooks/stripe', express.raw({ type: '*/*' })); // it is perfect for localhost // working
      // // in main.ts file

      // const rawBody = (req as any).rawBody; // ✅ actual raw buffer
      // const rawBody = req.body;
      const rawBody = req.body as Buffer;
      await this.paymentService.handleStripeWebhook(rawBody, signature);
      console.log('✅ Webhook handled successfully');
      return res.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      console.error('❌ Webhook error:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
