import { type ApiPromise } from '@polkadot/api';
import { MAIN_CONFIG } from './config';
import pino, { type Logger, type LoggerOptions } from 'pino';
import { createApi, retryHttpAsyncCall } from './polkadot/polka';
import { PrometheusClient } from './metrics/prometheus';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const invertObject = (obj: Record<string, any>) => {
  if (obj == null) {
    throw new Error('obj is null');
  }

  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
};

export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const createReadPalletApi = async (): Promise<ApiPromise> => {
  const palletRpcUrl: string = MAIN_CONFIG.PALLET_RPC_URL;

  PrometheusClient.createReadApi.inc(1);

  return await retryHttpAsyncCall(async () => await createApi(palletRpcUrl));
};

export const createWritePalletApi = async (): Promise<ApiPromise> => {
  const votingRpcUrl: string = MAIN_CONFIG.VOTING_RPC_URL;

  PrometheusClient.createWriteApi.inc(1);

  return await retryHttpAsyncCall(async () => await createApi(votingRpcUrl));
};

export const createLogger = (options: string | LoggerOptions): Logger => {
  if (MAIN_CONFIG.PRETTY_PRINT) {
    const prettyTransport = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:HH:MM:ss',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return pino(prettyTransport);
  }

  return pino({
    ...(typeof options === 'string' ? { name: options } : options),
  });
};
