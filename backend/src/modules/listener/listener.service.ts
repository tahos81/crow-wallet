import { Injectable } from '@nestjs/common';
import {
  CHAIN_ID,
  getERC20Contract,
  getRpcProvider,
  getSettlementContract,
  getWsProvider,
} from 'src/utils/getRpcProvider';
import { PublisherService } from 'src/modules/publisher/publisher.service';
import { ethers, AbiCoder } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { Repository } from 'typeorm';
import {
  FillInstructionDto,
  newGaslessOrderDto,
  newOnchainOrderDto,
  OutputDto,
} from 'src/modules/listener/dto/listener.dto';
import { ADDRESSES } from 'src/constants';

const abiCoder = new AbiCoder();

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
    const { signature, transactionHash, ...order } = newOrder;

    console.log('New order: ', order);

    // const isValid = await this.validateOnchainOrder(order);

    // if (!isValid) {
    //   throw new Error('Invalid onchain order');
    // }

    // todo: decode order to resolvedCCOrder
    const settlementContract = getSettlementContract(CHAIN_ID.ALPHANET);

    const resolvedOrder = await settlementContract.resolve(order);

    const fillerAddress: string = abiCoder.decode(
      ['address'],
      resolvedOrder[0],
    )[0];
    const originChainId: bigint = resolvedOrder[1];
    const openDeadline: bigint = resolvedOrder[2];
    const fillDeadline: bigint = resolvedOrder[3];
    const orderId: string = resolvedOrder[4];
    // todo: support multiple maxSpent
    const maxSpentArray = resolvedOrder[5][0];
    const maxSpent: OutputDto = {
      token: abiCoder.decode(['address'], maxSpentArray[0])[0],
      amount: maxSpentArray[1],
      recipient: abiCoder.decode(['address'], maxSpentArray[2])[0],
      chainId: maxSpentArray[3],
    };
    // todo: support multiple minReceived
    const minReceivedArray = resolvedOrder[6][0];
    const minReceived: OutputDto = {
      token: abiCoder.decode(['address'], minReceivedArray[0])[0],
      amount: minReceivedArray[1],
      recipient: abiCoder.decode(['address'], minReceivedArray[2])[0],
      chainId: minReceivedArray[3],
    };
    const fillInstructionsArray = resolvedOrder[7][0];
    const fillInstruction: FillInstructionDto = {
      destinationChainId: fillInstructionsArray[0],
      destinationSettler: abiCoder.decode(['address'], fillInstructionsArray[1])[0],
      originData: fillInstructionsArray[2], // crow order and signature
    };

    const { amount, token, chainId } = resolvedOrder.maxSpent[0];

    const tokenContract = getERC20Contract(token, chainId);

    const allowance: bigint = await tokenContract.allowance(
      ADDRESSES.ACCOUNT,
      ADDRESSES.DESTINATION_SETTLEMENT,
    );

    // if (allowance < amount) {
    //   console.log('Approving token...');
    //   const approval = await tokenContract.approve(
    //     ADDRESSES.DESTINATION_SETTLEMENT,
    //     ethers.MaxUint256,
    //   );

    //   await approval.wait();
    //   console.log('Approved!');
    // }

    // const signer = getSigner();
    // const signerAddress = signer.getAddress();

    // const settlementContract = getSettlementContract();

    // const fill = await settlementContract.fill(
    //   orderId,
    //   order.orderData,
    //   signerAddress,
    // );

    // const receipt = await fill.wait();
    // console.log('Order filled!', receipt.transactionHash);
  }

  public async newGaslessOrder(newOrder: newGaslessOrderDto): Promise<void> {
    const { signature, ...order } = newOrder;

    const isValid = await this.validateGaslessOrder(order);

    // todo: decode order to resolvedCCOrder
  }

  async validateOnchainOrder(
    order: Omit<newOnchainOrderDto, 'signature' | 'transactionHash'>,
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

  async getIntentData(transactionHash: string): Promise<{
    transaction: ethers.TransactionReceipt;
    log: ethers.Log;
  }> {
    const provider = getRpcProvider(CHAIN_ID.ALPHANET);

    const topic =
      '0x571749edf1d5c9599318cdbc4e28a6475d65e87fd3b2ddbe1e9a8d5e7a0f0ff7'.toLowerCase();

    const transaction = await provider.getTransactionReceipt(transactionHash);

    const logs = await provider.getLogs({
      fromBlock: transaction.blockNumber,
      toBlock: transaction.blockNumber,
    });

    const relatedLogs = logs.filter(
      (log) =>
        log.transactionHash.toLowerCase() === transactionHash.toLowerCase() &&
        log.topics[0].toLowerCase() === topic.toLowerCase(),
    );

    return { transaction, log: relatedLogs[0] };
  }

  async test(): Promise<void> {
    // const { transaction, log } = await this.getIntentData(
    //   '0x49ba9a5a30246a6bbc64ee0f7e01205cb230af45f3d674b034bd0c95cb0e6a96',
    // );

    const order = {
      transactionHash:
        '0x49ba9a5a30246a6bbc64ee0f7e01205cb230af45f3d674b034bd0c95cb0e6a96',
      signature:
        '0x49ba9a5a30246a6bbc64ee0f7e01205cb230af45f3d674b034bd0c95cb0e6a96',
      fillDeadline: 1731776646,
      orderDataType:
        '0x14a1ec3370924385dde81afb955e8b7b4622456fd879688f69853490fdbfb263',
      orderData:
        '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000114b242d931b47d5cdcee7af065856f70ee278c400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000114b242d931b47d5cdcee7af065856f70ee278c400000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a307831323334353637380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000029876000000000000000000000000000000000000000000000000000000000000',
    };

    await this.newOnchainOrder(order);
  }
}