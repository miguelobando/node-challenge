import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Token } from './interfaces/token';
import { stats } from '../../entities/stats.entity';
import { StatsResponse } from './interfaces/statsResponse';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(stats) private statRepository: Repository<stats>,
    private readonly authService: AuthService,
  ) {}

  async getStats(token: string): Promise<StatsResponse> {
    const a = this.authService.decodeToken(token) as Token;
    if (a.role === 'admin') {
      const query = await this.statRepository.find({
        order: {
          times_requested: 'DESC',
        },
        take: 5,
      });

      return {
        status: 200,
        data: query,
      };
    }
    return {
      status: 401,
    };
  }

  async addRequest(stock: string) {
    const result = await this.statRepository.findOne({
      where: {
        stock: stock,
      },
    });

    if (!result) {
      await this.statRepository.save({
        stock: stock,
        times_requested: 1,
      });
    } else {
      await this.statRepository.update(
        {
          stock: stock,
        },
        {
          times_requested: result.times_requested + 1,
        },
      );
    }
  }
}
