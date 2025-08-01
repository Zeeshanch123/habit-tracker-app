import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
// import bodyParser, { json, urlencoded } from 'body-parser';
import * as bodyParser from 'body-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: false, // Disable default body parsing for webhooks
  });
  app.enableCors();

  // app.use('/payments/webhooks/stripe', express.raw({ type: '*/*' })); //  localhost > working
  //

  // ⚠️ Raw body for Stripe webhook route ONLY - must come before json middleware
  // app.use('/payments/webhooks/stripe', express.raw({ type: 'application/json' }));
  // app.use((req, res, next) => {
  //   if (req.originalUrl === '/payments/webhooks/stripe') {
  //     express.raw({ type: 'application/json' })(req, res, next);
  //   } else {
  //     express.json()(req, res, next);
  //   }
  // });

  // app.use('/payments/webhooks/stripe', bodyParser.raw({ type: '*/*' }));
  app.use('/payments/webhooks/stripe', express.raw({ type: 'application/json' }));

  // app.use(json());
  // app.use(urlencoded({ extended: true }));
  app.use(bodyParser.json());        // <-- Parse JSON request bodies
  app.use(bodyParser.urlencoded({ extended: true }));
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`✅ Server is running on ${port}!`);
  console.log('DB_HOST:', process.env.DB_HOST);
}
bootstrap();
