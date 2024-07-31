import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stock } from '../../entities/stock.entity';
import { StockResponse } from './interfaces/stockResponse';
import { firstValueFrom } from 'rxjs';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class StockService {
  constructor(
    @Inject('STOCK_SERVICE') private client: ClientProxy,
    @InjectRepository(stock) private stockRepository: Repository<stock>,
    private readonly statsService: StatsService,
  ) {}

  async getStock(stockCode: string) {
    await this.statsService.addRequest(stockCode);
    const result = await this.stockRepository.findOne({
      select: [
        'symbol',
        'date',
        'time',
        'open',
        'high',
        'low',
        'close',
        'volume',
        'name',
      ],
      where: {
        symbol: stockCode,
      },
      order: {
        date: 'DESC',
      },
    });
    const currentDate = new Date();
    if (!result || new Date(result.date) < currentDate) {
      const stockDataFromApi = await firstValueFrom(
        this.client.send<StockResponse>({ cmd: 'stock' }, stockCode),
      );

      if (!result || new Date(result.date) < new Date(stockDataFromApi.Date)) {
        await this.saveStock(stockDataFromApi);
      }

      return stockDataFromApi;
    }

    return result;
  }

  async getHistoricalStock() {
    const result = await this.stockRepository.find({
      order: {
        insertdate: 'DESC',
      },
    });

    if (result.length === 0) {
      return [];
    }

    return result;
  }

  private async saveStock(stockData: StockResponse) {
    const stockDataToSave = new stock();
    stockDataToSave.symbol = stockData.Symbol;
    stockDataToSave.date = stockData.Date;
    stockDataToSave.time = stockData.Time;
    stockDataToSave.open = parseFloat(stockData.Open);
    stockDataToSave.high = parseFloat(stockData.High);
    stockDataToSave.low = parseFloat(stockData.Low);
    stockDataToSave.close = parseFloat(stockData.Close);
    stockDataToSave.volume = parseInt(stockData.Volume);
    stockDataToSave.name = stockData.Name;

    await this.stockRepository.save(stockDataToSave);
  }
}
