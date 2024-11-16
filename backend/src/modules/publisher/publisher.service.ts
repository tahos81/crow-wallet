import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { JwtService } from '@nestjs/jwt';
import { AbiCoder } from 'ethers';

const abiCoder = new AbiCoder();

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private jwtService: JwtService,
  ) {}

  public async getOrder(): Promise<void> {
    return;
  }

  public async executeOrder(): Promise<void> {
    return;
  }
}
