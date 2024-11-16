import { Body, Controller, Post } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { newGaslessOrderDto, newOnchainOrderDto } from './dto/listener.dto';

@Controller()
export class PublisherController {
  constructor(private listenerService: ListenerService) {}

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
