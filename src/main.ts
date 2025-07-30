import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
// import bodyParser, { json, urlencoded } from 'body-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // rawBody: true, // Enable raw body parsing
    // bodyParser: true, // Ensure body parser is enabled

    bodyParser: false,
  });

  app.enableCors();

  // 🔐 Raw body ONLY for Stripe webhook
  // app.use('/payments/webhooks/stripe', express.raw({ type: '*/*' })); // it is perfect for localhost // working
  // app.use('/payments/webhooks/stripe', express.raw({ type: 'application/json' })); // live production // not working
  // app.use(
  //   '/payments/webhooks/stripe',
  //   express.raw({ type: 'application/json' }),
  //   (req, res, next) => {
  //     (req as any).rawBody = req.body; // capture raw body BEFORE it's parsed
  //     next();
  //   },
  // );

  // app.use('/payments/webhooks/stripe', bodyParser.raw({ type: 'application/json' }));

  // 🔥 CRITICAL: Apply raw body parser ONLY to Stripe webhook endpoint
  app.use('/payments/webhooks/stripe', express.raw({ 
    type: 'application/json'
  }));

  // ✅ Global parsers for everything else
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Habit Tracker API')
    .setDescription('API documentation for Habit Tracker')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`✅ Server is running on ${port}!`);
  console.log('DB_HOST:', process.env.DB_HOST);
}
bootstrap();
