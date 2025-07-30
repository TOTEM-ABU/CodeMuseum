import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Codes example')
      .setDescription('The Code API description')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

  const PORT = parseInt(process.env.APP_PORT as string) || 3000;
  const domen = process.env.SERVER_DOMEN;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(domen);
  });
}
bootstrap();
