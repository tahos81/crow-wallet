import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from 'src/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  await app.listen(CONFIG.PORT);
}
bootstrap();
