import { Module } from '@nestjs/common';
import { StockServiceController } from './stock-service.controller';
import { StockServiceService } from './stock-service.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'STOCK_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RMQ_URL')],
            queue: configService.get<string>('RMQ_QUEUE'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [StockServiceController],
  providers: [StockServiceService],
})
export class StockServiceModule {}
