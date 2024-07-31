import { Controller, Get, Headers, Res, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Response as responseType } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The stats has been successfully retrieved.',
  })
  @ApiResponse({
    status: 401,
    description:
      'The user does not have the necesary role or is not authenticated',
  })
  @ApiOperation({
    summary: 'Return the most searched stock ',
  })
  @Get()
  async getStats(
    @Headers('Authorization') token: string,
    @Res() res: responseType,
  ) {
    const tokenToSend = token.split(' ')[1];
    const result = await this.statsService.getStats(tokenToSend);
    return res.status(result.status).json(result.data);
  }
}
