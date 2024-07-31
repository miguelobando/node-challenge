import { Test, TestingModule } from '@nestjs/testing';
import { StockServiceController } from './stock-service.controller';
import { StockServiceService } from './stock-service.service';

describe('StockServiceController', () => {
  let stockServiceController: StockServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StockServiceController],
      providers: [StockServiceService],
    }).compile();

    stockServiceController = app.get<StockServiceController>(StockServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(stockServiceController.getHello()).toBe('Hello World!');
    });
  });
});
