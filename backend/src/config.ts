import { config as loadEnvironment } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from 'src/entities/';
loadEnvironment();

export const CONFIG: Config = {
  DBCONFIG: {
    type: 'postgres',
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    port: Number(process.env.DB_PORT),
    entities: [Order],
    autoLoadEntities: true,
    synchronize: true,
    retryAttempts: 20,
    connectTimeout: 30000,
    acquireTimeout: 30000,
  } as TypeOrmModuleOptions,
  PORT: Number(process.env.APP_PORT),
  RESPONSE_LIMIT: Number(process.env.RESPONSE_LIMIT),
  BUCKET_URL: process.env.BUCKET_URL,
  NETWORK_RPC_URL_A: process.env.NETWORK_RPC_URL_A,
  NETWORK_RPC_URL_B: process.env.NETWORK_RPC_URL_B,
  NETWORK_WS_URL: process.env.NETWORK_WS_URL,
  RABBIT_SERVICE_NAME: process.env.RABBIT_SERVICE_NAME,
  RABBIT_URL: process.env.RABBIT_URL,
  RABBIT_QUEUE: process.env.RABBIT_QUEUE,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
};

type Config = {
  DBCONFIG: TypeOrmModuleOptions;
  PORT: number;
  RESPONSE_LIMIT: number;
  BUCKET_URL: string;
  NETWORK_RPC_URL_A: string;
  NETWORK_RPC_URL_B: string;
  NETWORK_WS_URL: string;
  RABBIT_SERVICE_NAME: string;
  RABBIT_URL: string;
  RABBIT_QUEUE: string;
  PRIVATE_KEY: string;
  JWT_SECRET: string;
  ALCHEMY_API_KEY: string;
};
