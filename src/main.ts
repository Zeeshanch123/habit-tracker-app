// import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Habit Tracker API')
    .setDescription('API documentation for Habit Tracker API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
