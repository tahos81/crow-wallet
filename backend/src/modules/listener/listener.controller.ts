import { Body, Controller, Post, Get } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { newGaslessOrderDto, newOnchainOrderDto } from './dto/listener.dto';

@Controller()
export class ListenerController {
  constructor(private listenerService: ListenerService) {}

  @Get('test')
  async test(): Promise<void> {
    return await this.listenerService.test();
  }

  @Post('new_onchain_order')
  async newOnchainOrder(
    @Body() newOrderDto: newOnchainOrderDto,
  ): Promise<void> {
    return await this.listenerService.newOnchainOrder(newOrderDto);
  }

  @Post('new_gasless_order')
  async newGaslessOrder(
    @Body() newOrderDto: newGaslessOrderDto,
  ): Promise<void> {
    return await this.listenerService.newGaslessOrder(newOrderDto);
  }
}
