import { MAIN_CONFIG } from './config';
import { type KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/api';

export const createKeyringPair = (): KeyringPair => {
  const property: string = MAIN_CONFIG.VOTING_WORKER_SEED;

  if (property === '' || property == null) {
    throw new Error('Missing VOTING_WORKER_SEED');
  }

  const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

  if (property.startsWith('0x') || property.startsWith('_0x')) {
    return keyring.addFromUri(property.replace('_', ''));
  }

  return keyring.addFromMnemonic(property);
};
