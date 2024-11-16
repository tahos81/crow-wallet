import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum OrderStatus {
  NEW = "NEW",
  PENDING = "PENDING",
  FILLED = "FILLED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  RETRY = "RETRY",
}


@Entity({ name: "order" })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "swapper_wallet" })
  swapperWallet: string;

  @Column({ name: "status" })
  status: OrderStatus;

  @Column({ name: "nonce" })
  nonce: number;

  @Column({ name: "signature" })
  signature: string;

  @Column({ name: "created", type: "timestamptz" })
  created: Date;

  @Column({ name: "initiate_deadline_block" })
  initiateDeadlineBlock: number;

  @Column({ name: "fill_deadline_block" })
  fillDeadlineBlock: number;

  @Column({ name: "origin_chain_id" })
  originChainId: number;

  @Column({ name: "origin_token" })
  originToken: string;

  @Column({ name: "origin_amount" })
  originAmount: number;

  @Column({ name: "destination_chain_id" })
  destinationChainId: number;

  @Column({ name: "destination_token" })
  destinationToken: string;

  @Column({ name: "destination_amount" })
  destinationAmount: number;
}
