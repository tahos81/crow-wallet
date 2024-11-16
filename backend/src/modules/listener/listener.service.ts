import { Injectable } from '@nestjs/common';
import {
  getAccountContract,
  getERC20Contract,
  getSettlementContract,
  getSigner,
  getWsProvider,
} from 'src/utils/getRpcProvider';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';
import {
  newGaslessOrderDto,
  newOnchainOrderDto,
  ResolvedCrossChainOrderDTO,
} from 'src/modules/listener/dto/listener.dto';
import { ADDRESSES } from 'src/constants';

@Injectable()
export class ListenerService {
  wsProvider: ethers.WebSocketProvider;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private readonly publisherService: PublisherService,
  ) {
    this.wsProvider = getWsProvider();
  }

  public async newOnchainOrder(newOrder: newOnchainOrderDto): Promise<void> {
    const { signature, ...order } = newOrder;

    console.log('New order: ', order);

    const isValid = await this.validateOnchainOrder(order);

    if (!isValid) {
      throw new Error('Invalid onchain order');
    }

    // todo: decode order to resolvedCCOrder
    const accountContract = getAccountContract();

    const resolvedOrder: ResolvedCrossChainOrderDTO =
      await accountContract.resolveFor(order);

    console.log('Resolved order: ', resolvedOrder);

    const { amount, token, chainId } = resolvedOrder.maxSpent[0];

    const tokenContract = getERC20Contract(token, chainId);

    const allowance: bigint = await tokenContract.allowance(
      ADDRESSES.ACCOUNT,
      ADDRESSES.DESTINATION_SETTLEMENT,
    );

    if (allowance < amount) {
      console.log('Approving token...');
      const approval = await tokenContract.approve(
        ADDRESSES.DESTINATION_SETTLEMENT,
        ethers.MaxUint256,
      );

      await approval.wait();
      console.log('Approved!');
    }

    const signer = getSigner();
    const signerAddress = signer.getAddress();

    const settlementContract = getSettlementContract();

    const orderId = resolvedOrder.orderId;
    const fill = await settlementContract.fill(
      orderId,
      order.orderData,
      signerAddress,
    );

    const receipt = await fill.wait();
    console.log('Order filled!', receipt.transactionHash);
  }

  public async newGaslessOrder(newOrder: newGaslessOrderDto): Promise<void> {
    const { signature, ...order } = newOrder;

    const isValid = await this.validateGaslessOrder(order);

    // todo: decode order to resolvedCCOrder
  }

  async validateOnchainOrder(
    order: Omit<newOnchainOrderDto, 'signature'>,
  ): Promise<boolean> {
    // todo: validate order

    const nowInSeconds = Math.floor(Date.now() / 1000);

    return order.fillDeadline > nowInSeconds;
  }

  async validateGaslessOrder(
    order: Omit<newGaslessOrderDto, 'signature'>,
  ): Promise<boolean> {
    // todo: validate order

    const nowInSeconds = Math.floor(Date.now() / 1000);

    return order.fillDeadline > nowInSeconds;
  }
}
