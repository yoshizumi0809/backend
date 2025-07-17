import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  app.enableCors({
    origin: ['https://frontend-623f.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ←これ追加！
    credentials: true,
  });

  console.log(`listening on port ${port}`);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
