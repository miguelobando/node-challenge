import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockService } from './stock.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The stock has been successfully retrieved.',
  })
  @ApiResponse({
    status: 401,
    description: 'The user is not authenticated',
  })
  @ApiOperation({ summary: 'Finds stock data according to a code' })
  @Get('stock')
  async getStock(@Query('q') stockCode: string) {
    return this.stockService.getStock(stockCode);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The historical records has been successfully retrieved.',
  })
  @ApiOperation({ summary: 'History of queries made to the api service' })
  @Get('history')
  async getHistory() {
    return this.stockService.getHistoricalStock();
  }
}
