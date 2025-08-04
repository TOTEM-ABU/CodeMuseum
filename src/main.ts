import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

   app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://code-musuem.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['authorization', 'content-type'],
    optionsSuccessStatus: 200,
  });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );  

    const config = new DocumentBuilder()
      .setTitle('Codes example')
      .setDescription('The Code API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

  const PORT = parseInt(process.env.APP_PORT as string) || 3000;
  const domen = process.env.SERVER_DOMEN;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(domen);
  });
}
bootstrap();
