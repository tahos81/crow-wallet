import { Controller, Get, Post } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Controller()
export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  @Get('get_orders')
  async pixels(): Promise<void> {
    return await this.publisherService.getOrder();
  }

  @Post('execute_order')
  async placePixel(): Promise<unknown> {
    return await this.publisherService.executeOrder();
  }
}