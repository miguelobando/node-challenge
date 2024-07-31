import { NestFactory } from '@nestjs/core';
import { StockServiceModule } from './stock-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(StockServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}
bootstrap();
