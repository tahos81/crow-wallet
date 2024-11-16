import { ethers } from 'ethers';
import { CONFIG } from 'src/config';
import { ADDRESSES, ABIS } from 'src/constants';

export const CHAIN_ID = {
  MEKONG: 7078815900,
  ODYSSEY: 911867,
};

export const RPC_URLS = {
  [CHAIN_ID.ODYSSEY]: CONFIG.NETWORK_RPC_URL_A,
  [CHAIN_ID.MEKONG]: CONFIG.NETWORK_RPC_URL_B,
};

export class JsonRpcProvider extends ethers.JsonRpcProvider {}

export type ProviderEventFilter = {
  address: string;
  topics: Array<string>;
};

export const getRpcProvider = (chainId = CHAIN_ID.MEKONG): JsonRpcProvider => {
  const rpcUrl = RPC_URLS[chainId] ?? CONFIG.NETWORK_RPC_URL_A;
  const provider = new JsonRpcProvider(rpcUrl);
  return provider;
};

export const getWsProvider = (): ethers.WebSocketProvider => {
  const provider = new ethers.WebSocketProvider(CONFIG.NETWORK_WS_URL);
  return provider;
};

export const getENSProvider = (): JsonRpcProvider => {
  return new JsonRpcProvider('https://rpc.ankr.com/eth');
};

export const getSigner = (chainId = CHAIN_ID.MEKONG): ethers.Signer => {
  const provider = getRpcProvider(chainId);

  return new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
};

export const getAccountContract = (
  address = ADDRESSES.ACCOUNT,
  chainId = CHAIN_ID.MEKONG,
): ethers.Contract => {
  const wallet = getSigner(chainId);

  return new ethers.Contract(address, ABIS.ACCOUNT, wallet);
};

export const getERC20Contract = (
  tokenAddress: string,
  chainId = CHAIN_ID.MEKONG,
): ethers.Contract => {
  const wallet = getSigner(chainId);

  return new ethers.Contract(tokenAddress, ABIS.ERC20, wallet);
};

export const getSettlementContract = (
  chainId = CHAIN_ID.MEKONG,
): ethers.Contract => {
  const wallet = getSigner(chainId);
  return new ethers.Contract(
    ADDRESSES.DESTINATION_SETTLEMENT,
    ABIS.SETTLEMENT,
    wallet,
  );
};
