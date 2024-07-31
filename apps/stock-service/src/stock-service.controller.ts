import { Controller } from '@nestjs/common';
import { StockServiceService } from './stock-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class StockServiceController {
  constructor(private readonly stockServiceService: StockServiceService) {}

  @MessagePattern({ cmd: 'stock' })
  async getStock(stockCode: string) {
    return await this.stockServiceService.getStock(stockCode);
  }
}
