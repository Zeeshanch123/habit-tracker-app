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
  private readonly logger = new Logger(PaymentsController.name);
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
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      this.logger.log('🔥 PRODUCTION WEBHOOK DEBUG:');
      this.logger.log(`📦 Signature: ${signature?.substring(0, 50)}...`);
      this.logger.log(`🧾 Body type: ${typeof req.body}`);
      this.logger.log(`🧾 Body is Buffer: ${Buffer.isBuffer(req.body)}`);
      this.logger.log(`🧾 Body length: ${req.body?.length || 0}`);
      this.logger.log(`🧾 Content-Type: ${req.headers['content-type']}`);
      if (!signature) {
        this.logger.error('❌ Missing stripe-signature header');
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Missing stripe-signature header'
        });
      }

      if (!req.body) {
        this.logger.error('❌ Missing request body');
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Missing request body'
        });
      }
      //
      // // const rawBody = (req as any).body; // Stripe will get the raw body now
      // // console.log("rawBody:", rawBody);
      // // This above 2 lines is working for localhost webhook logs if we enable this below line 
      // // app.use('/payments/webhooks/stripe', express.raw({ type: '*/*' })); // it is perfect for localhost // working
      // // in main.ts file

      // // now this below is for live production req,ote hosting
      // // const rawBody = (req as any).rawBody as Buffer; //now it's truly raw
      // // console.log("rawBody:", rawBody);

      // // const signature = req.headers['stripe-signature'];
      // const signature = req.headers['stripe-signature'] as string;
      // // const rawBody = req.rawBody;
      // const rawBody = req.body as Buffer;
      //
      // 🔥 CRITICAL: Ensure we have raw Buffer
      let rawBody: Buffer;
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body;
        this.logger.log('✅ Body is already a Buffer');
      } else if (typeof req.body === 'string') {
        rawBody = Buffer.from(req.body, 'utf8');
        this.logger.log('✅ Converted string to Buffer');
      } else {
        // If it's an object, convert back to JSON string then to Buffer
        rawBody = Buffer.from(JSON.stringify(req.body), 'utf8');
        this.logger.log('⚠️ Had to convert object back to Buffer - this might cause issues');
      }

      this.logger.log(`🔥 Final Buffer length: ${rawBody.length}`);
      this.logger.log(`🔥 Buffer preview: ${rawBody.toString('utf8').substring(0, 100)}...`);

      //
      await this.paymentService.handleStripeWebhook(rawBody, signature);
      console.log('✅ Webhook handled successfully');
      this.logger.log('✅ Webhook processed successfully');
      return res.status(HttpStatus.OK).json({ received: true });
      // return res.send({ received: true });
      // return res.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      console.error('❌ Webhook error:', err.message);
      this.logger.error(`❌ Webhook error: ${err.message}`);
      this.logger.error(`❌ Stack: ${err.stack}`);
      // return res.status(400).send(`Webhook Error: ${err.message}`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Webhook processing failed',
        message: err.message
      });
      // return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
