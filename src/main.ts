import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './middleware/errorhandling.middleware';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('API ECOM')
    .setDescription('API ECOM')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(
    {
      origin: process.env.FRONTEND_URL,
      methods: 'GET,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 200,
      credentials: true,
      allowedHeaders: 'Content-Type, Accept',
    },
  );
  await app.listen(3000);
}
bootstrap();
