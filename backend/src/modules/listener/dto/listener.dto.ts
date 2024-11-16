export class baseOrderDto {
  fillDeadline: number;
  orderDataType: string;
  orderData: string;
  signature?: string;
}

export class newOnchainOrderDto extends baseOrderDto {
  transactionHash: string;
}

export class newGaslessOrderDto extends newOnchainOrderDto {
  originSettler: string;
  user: string;
  nonce: number;
  originChainId: number;
  openDeadline: number;
  signature: string;
}

export class OutputDto {
  token: string;
  amount: bigint;
  recipient: string;
  chainId: bigint;
}

export class FillInstructionDto {
  destinationChainId: number;
  destinationSettler: string;
  originData: string;
}

export class ResolvedCrossChainOrderDTO {
  user: string;
  originChainId: number;
  openDeadline: number;
  fillDeadline: number;
  orderId: string;
  maxSpent: Array<OutputDto>;
  minReceived: Array<OutputDto>;
  fillInstructions: Array<FillInstructionDto>;
}
