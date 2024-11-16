export class baseOrderDto {
  fillDeadline: number;
  orderDataType: string;
  orderData: string;
  signature: string;
}

export class newGaslessOrderDto extends baseOrderDto {
  originSettler: string;
  user: string;
  nonce: number;
  originChainId: number;
  openDeadline: number;
  transactionHash: string;
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

export class newOnchainOrderDto extends ResolvedCrossChainOrderDTO {
  transactionHash: string;
}
