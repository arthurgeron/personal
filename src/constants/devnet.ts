import type { Block } from '../types/interfaces';

export const BLOCK_MS = 2000;
export const FINALITY = 3;
export const STRIP = 7;
export const DEPTHS = Array.from({ length: FINALITY }, (_, depth) => depth + 1);

export const GENESIS: Block = {
  height: 127,
  hash: 'e3ce2d0e552817124ce001e71e797b4bb87a0ddb534a77ed376c207aa224f3c2',
  tx: '',
};

export const TRANSFER = { amount: 0.01, fee: 0.00021, to: '0x5f3b…c0de' };
export const COST = TRANSFER.amount + TRANSFER.fee;
export const BALANCE = 1.25;
export const FIRST_NONCE = 7;

export const FAULTS = [
  { key: 'drop', label: 'drop it from the mempool' },
  { key: 'reorg', label: 'reorg its first block' },
] as const;

export const IDLE = {
  label: 'idle',
  text: 'Nothing in flight. Nothing leaves this page.',
};
