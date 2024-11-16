import { ethers } from 'ethers';
import { CONFIG } from 'src/config';
import { ADDRESSES, ABIS } from 'src/constants';

export class JsonRpcProvider extends ethers.JsonRpcProvider {}

export type ProviderEventFilter = {
  address: string;
  topics: Array<string>;
};

export const getRpcProvider = (): JsonRpcProvider => {
  const provider = new JsonRpcProvider(CONFIG.NETWORK_RPC_URL);
  return provider;
};

export const getWsProvider = (): ethers.WebSocketProvider => {
  const provider = new ethers.WebSocketProvider(CONFIG.NETWORK_WS_URL);
  return provider;
};

export const getENSProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider('https://rpc.ankr.com/eth');
};

export const getSigner = (): ethers.Signer => {
  const provider = getRpcProvider();

  return new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
};

export const getAccountContract = (): ethers.Contract => {
  const wallet = getSigner();

  return new ethers.Contract(ADDRESSES.ACCOUNT, ABIS.ACCOUNT, wallet);
};
