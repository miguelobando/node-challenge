import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Just an endpoint to check if the service is runing',
  })
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
