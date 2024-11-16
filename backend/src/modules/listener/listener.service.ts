import { Injectable } from '@nestjs/common';
import {
  CHAIN_ID,
  getAccountContract,
  getERC20Contract,
  getRpcProvider,
  getSettlementContract,
  getSigner,
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
    const originSettlementContract = getSettlementContract(CHAIN_ID.ODYSSEY);

    const resolvedOrder = getResolvedOrder();
    // await originSettlementContract.resolve(order);

    const accountAddress: string = bytes32ToAddress(resolvedOrder[0]);
    const originChainId: bigint = resolvedOrder[1];
    const openDeadline: bigint = resolvedOrder[2];
    const fillDeadline: bigint = resolvedOrder[3];
    const orderId: string = resolvedOrder[4];
    // todo: support multiple maxSpent
    const maxSpentArray = resolvedOrder[5][0];
    const maxSpent: OutputDto = {
      token: bytes32ToAddress(maxSpentArray[0]),
      amount: maxSpentArray[1],
      recipient: bytes32ToAddress(maxSpentArray[2]),
      chainId: maxSpentArray[3],
    };
    // todo: support multiple minReceived
    const minReceivedArray = resolvedOrder[6][0];
    const minReceived: OutputDto = {
      token: bytes32ToAddress(minReceivedArray[0]),
      amount: minReceivedArray[1],
      recipient: bytes32ToAddress(minReceivedArray[2]),
      chainId: minReceivedArray[3],
    };
    const fillInstructionsArray = resolvedOrder[7][0];

    const abi = [
      'tuple(tuple(address token, uint256 amount, uint32 dstChainId, tuple(address target, bytes callData, uint256 value)[] xCalls) orderData, bytes signature)',
    ];

    const fillInstruction: FillInstructionDto = {
      destinationChainId: fillInstructionsArray[0],
      destinationSettler: bytes32ToAddress(fillInstructionsArray[1]),
      originData: fillInstructionsArray[2], // crow order and signature
    };
    const [crowOrderDataWithSig] = abiCoder.decode(
      abi,
      fillInstructionsArray[2],
    );
    const [crowOrderData, signatureOfCrowOrder] = crowOrderDataWithSig;

    console.log('all datas: ', {
      accountAddress,
      originChainId,
      openDeadline,
      fillDeadline,
      orderId,
      maxSpent,
      minReceived,
      fillInstruction,
      crowOrderDataWithSig,
      crowOrderData,
      signatureOfCrowOrder,
    });

    const { amount, token, chainId } = maxSpent;

    // todo: update chainid
    const tokenContract = getERC20Contract(token, Number(7078815900));

    const signer = getSigner();
    const fillerAddress = await signer.getAddress();

    const allowance: bigint = await tokenContract.allowance(
      fillerAddress,
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

    const accountContract = getAccountContract(
      Number(fillInstruction.destinationChainId),
    );

    console.log({ orderId, crowOrderDataWithSig, fillerAddress });

    const fill = await accountContract.fill(
      orderId,
      fillInstructionsArray[2],
      fillerAddress,
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
    const provider = getRpcProvider(CHAIN_ID.ODYSSEY);

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

    // const order = {
    //   transactionHash:
    //     '0x49ba9a5a30246a6bbc64ee0f7e01205cb230af45f3d674b034bd0c95cb0e6a96',
    //   signature:
    //     '0x49ba9a5a30246a6bbc64ee0f7e01205cb230af45f3d674b034bd0c95cb0e6a96',
    //   fillDeadline: 1731776646,
    //   orderDataType:
    //     '0x14a1ec3370924385dde81afb955e8b7b4622456fd879688f69853490fdbfb263',
    //   orderData:
    //     '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000e2632ce7bce542227fb5af075fda80155a84c9640000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000de9fb0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000203a9cdaa8b4fd1f726c5f22f27a64d8b5566fe0d4cb64736f6c634300081a0033',
    // };

    // await this.newOnchainOrder(order);

    const eventData =
      '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000028d944cdc2eb1781c0b67262a561b78a4110db9800000000000000000000000000000000000000000000000000000000000de9fb00000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000673a5e9cc9c21c6a55d2d72d8fee9b072f381e31d1096300fb001c13e0c2d037da61ecce000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f424000000000000000000000000028d944cdc2eb1781c0b67262a561b78a4110db9800000000000000000000000000000000000000000000000000000000000de9fb0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de9fb0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000de9fb00000000000000000000000028d944cdc2eb1781c0b67262a561b78a4110db98000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000de9fb00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e105257455388202798811360329087741368538457217888215936448151097230409929969359531189331348430041426167564233118896646016103929769412827264608860830887369340000000000000000000000000000000000000';
    const orderId = eventData.slice(0, 66);
    const resolvedOrderData = '0x' + eventData.slice(66);
    const [resolvedOrder] = abiCoder.decode(
      [
        'tuple(address user, uint256 originChainId, uint32 openDeadline, uint32 fillDeadline, bytes32 orderId, tuple(bytes32 token, uint256 amount, bytes32 recipient, uint256 chainId)[] maxSpent, tuple(bytes32 token, uint256 amount, bytes32 recipient, uint256 chainId)[] minReceived, tuple(uint64 destinationChainId, bytes32 destinationSettler, bytes originData)[] fillInstructions)',
      ],
      eventData,
    );

    console.log('Keccak256 Hash, order Id:', orderId);
    console.log('Resolved Order:', resolvedOrder);
  }
}

const getResolvedOrder = () => {
  const eventData =
    '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f1b9d129cdda9485fa300ccecc7bd1d82b6456ce00000000000000000000000000000000000000000000000000000000000de9fb00000000000000000000000000000000000000000000000000000000ffffffff00000000000000000000000000000000000000000000000000000000673a72f521f29e78d821ee9ea6c0663f5446fa8520d5686cc140d2a497d7553ae546057a000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000f1b9d129cdda9485fa300ccecc7bd1d82b6456ce00000000000000000000000000000000000000000000000000000001a5ee289c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de9fb0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000001a5ee289c000000000000000000000000f1b9d129cdda9485fa300ccecc7bd1d82b6456ce000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000c6ab1437507b4156b4dbfbe061b369f0973be8f400000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000001a5ee289c00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d402571120491025470673535267999143167456242248843463957889916531133377677889631351772352533161681890041715334950927719699810902712217659637647971482436017500000000000000000000000000000000000000';
  const [resolvedOrder] = abiCoder.decode(
    [
      'tuple(address user, uint256 originChainId, uint32 openDeadline, uint32 fillDeadline, bytes32 orderId, tuple(bytes32 token, uint256 amount, bytes32 recipient, uint256 chainId)[] maxSpent, tuple(bytes32 token, uint256 amount, bytes32 recipient, uint256 chainId)[] minReceived, tuple(uint64 destinationChainId, bytes32 destinationSettler, bytes originData)[] fillInstructions)',
    ],
    eventData,
  );

  return resolvedOrder;
};

const bytes32ToAddress = (bytes32: string): string => {
  return '0x'.concat(bytes32.slice(-40));
};
