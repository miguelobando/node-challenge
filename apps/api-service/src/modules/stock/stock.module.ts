import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { stock } from '../../entities/stock.entity';
import { StatsModule } from '../stats/stats.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    StatsModule,
    TypeOrmModule.forFeature([stock]),
    ConfigModule,
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
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
