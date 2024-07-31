import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

const api_p1 = 'https://stooq.com/q/l/?s';
const api_p2 = '&f=sd2t2ohlcvn&h&e=csv';
@Injectable()
export class StockServiceService {
  constructor(private readonly httpService: HttpService) {}

  async getStock(stockCode: string) {
    const res = await this.httpService.axiosRef.get(
      `${api_p1}=${stockCode}${api_p2}`,
    );
    const cleanedData = this.cleanData(res.data);
    return cleanedData;
  }

  cleanData(data: string) {
    const dataArr = data.split('\r\n');
    const dataFiltered = dataArr.map((item) => {
      return item.split(',');
    });

    const dataFiltered2 = [[...dataFiltered[0]], [...dataFiltered[1]]];
    const toSend = {};
    dataFiltered2[0].forEach((item, index) => {
      toSend[item] = dataFiltered2[1][index];
    });
    return toSend;
  }
}
