import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { StockServiceService } from './stock-service.service';
import { ConfigService } from '@nestjs/config';

describe('StockServiceService', () => {
  let service: StockServiceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockServiceService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            MAIL_USER: 'TEST@GMAIL.COM',
          },
        },
      ],
    }).compile();

    service = module.get<StockServiceService>(StockServiceService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getStock', () => {
    it('should return cleaned data for a valid stock code', async () => {
      const stockCode = 'AAPL.US';
      const rawData = `Symbol,Date,Time,Open,High,Low,Close,Volume,Name\r\nAAPL.US,2023-09-15,22:00:15,176.48,176.495,173.82,175.01,109259461,APPLE\r\n`;
      const expectedData = {
        Symbol: 'AAPL.US',
        Date: '2023-09-15',
        Time: '22:00:15',
        Open: '176.48',
        High: '176.495',
        Low: '173.82',
        Close: '175.01',
        Volume: '109259461',
        Name: 'APPLE',
      };

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValueOnce({ data: rawData });

      const result = await service.getStock(stockCode);

      expect(result).toEqual(expectedData);
    });
  });

  describe('cleanData', () => {
    it('should clean raw data into a key-value object', () => {
      const rawData = `Symbol,Date,Time,Open,High,Low,Close,Volume,Name\r\nAAPL.US,2023-09-15,22:00:15,176.48,176.495,173.82,175.01,109259461,APPLE\r\n`;

      const expectedData = {
        Symbol: 'AAPL.US',
        Date: '2023-09-15',
        Time: '22:00:15',
        Open: '176.48',
        High: '176.495',
        Low: '173.82',
        Close: '175.01',
        Volume: '109259461',
        Name: 'APPLE',
      };

      const result = service.cleanData(rawData);

      expect(result).toEqual(expectedData);
    });
  });
});
