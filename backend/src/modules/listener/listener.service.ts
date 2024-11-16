import { Injectable, OnModuleInit } from '@nestjs/common';
import { getWsProvider } from 'src/utils/getRpcProvider';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { ABIS, ADDRESSES } from 'src/constants';
import { Contract, ethers } from 'ethers';

@Injectable()
export class ListenerService implements OnModuleInit {
  wsProvider: ethers.WebSocketProvider;

  constructor(private readonly publisherService: PublisherService) {
    this.wsProvider = getWsProvider();
  }

  async onModuleInit() {
    // const contract = new Contract(
    //   ADDRESSES.ACCOUNT,
    //   ABIS.ACCOUNT,
    //   this.wsProvider,
    // );

    // contract.on('eventName', async (x, y, color, user) => {
    //   try {
    //     // TODO: handle event
    //   } catch (error) {
    //     console.error('Error eventName event:', error);
    //   }
    // });
    console.log('ListenerService initialized');
  }
}
