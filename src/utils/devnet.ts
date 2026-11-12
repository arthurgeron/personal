import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import {
  BALANCE,
  COST,
  FINALITY,
  FIRST_NONCE,
  GENESIS,
  IDLE,
  STRIP,
  TRANSFER,
} from '../constants/devnet';
import type { Block } from '../types/interfaces';
import { engine, still, wave } from './session';

type Phase = 'idle' | 'signing' | 'pending' | 'included' | 'final';

const sha256 = async (text: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)),
    ),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');

const seal = async (parent: Block, tx = ''): Promise<Block> => {
  const height = parent.height + 1;
  return {
    height,
    tx,
    hash: await sha256(`${parent.hash}${height}${tx}${Date.now()}`),
  };
};

export const short = (hash: string) => `${hash.slice(0, 6)}…${hash.slice(-4)}`;

export const eth = (value: number) => `${value.toFixed(5)} ETH`;

export const createDevnet = () => {
  const [blocks, setBlocks] = createSignal([GENESIS]);
  const [log, setLog] = createSignal([IDLE]);
  const [state, setState] = createStore({
    phase: 'idle' as Phase,
    id: '',
    block: 0,
    nonce: FIRST_NONCE,
    balance: BALANCE,
    drop: false,
    reorg: false,
  });
  let queue = Promise.resolve();

  const tip = () => blocks()[blocks().length - 1];
  const depth = () => tip().height - state.block + 1;
  const moving = () => state.phase === 'pending' || state.phase === 'included';
  const ready = () => state.phase === 'idle' || state.phase === 'final';

  const say = (label: string, text: string) =>
    setLog((lines) => [...lines.slice(-4), { label, text }]);

  const pulse = () => {
    const origin = engine.glyphs?.anchor('s3');
    if (origin) wave(...origin, 1.6);
  };

  const push = (block: Block) =>
    setBlocks((chain) => [...chain, block].slice(-STRIP));

  const fork = async () => {
    const [parent, lost] = blocks().slice(-2);
    setBlocks((chain) => [...chain.slice(0, -1), { ...lost, orphan: true }]);
    const first = await seal(parent);
    push(first);
    push(await seal(first));
    setState({ phase: 'pending', reorg: false });
    say(
      'reorged',
      `Block ${lost.height} lost to a longer fork. Back in the mempool with zero confirmations.`,
    );
  };

  const step = async () => {
    const phase = state.phase;
    if (phase === 'included' && state.reorg && depth() === 1) return fork();
    const picked = phase === 'pending' && !state.drop;
    const block = await seal(tip(), picked ? state.id : '');
    push(block);
    if (picked) {
      setState({ phase: 'included', block: block.height });
      say(
        'included',
        `In block ${block.height}. 1 of ${FINALITY} confirmations.`,
      );
    } else if (phase === 'pending') {
      setState({ phase: 'idle', drop: false });
      say(
        'dropped',
        `Block ${block.height} left it out and the mempool evicted it. Nothing was spent.`,
      );
    } else if (phase === 'included' && depth() < FINALITY) {
      say('included', `${depth()} of ${FINALITY} confirmations.`);
    } else if (phase === 'included') {
      setState({
        phase: 'final',
        nonce: state.nonce + 1,
        balance: state.balance - COST,
      });
      say(
        'final',
        `Final in block ${state.block}. ${eth(COST)} left the account.`,
      );
      pulse();
    }
  };

  // blocks are sealed one at a time, so two callers never build on the same tip
  const mine = () => {
    queue = queue.then(step);
    return queue;
  };

  const drain = async () => {
    while (still() && moving()) await mine();
  };

  const send = () => {
    if (!ready()) return;
    setState('phase', 'signing');
    say('signature', 'Waiting for your signature. Nothing is sent yet.');
  };

  const reject = () => {
    setState('phase', 'idle');
    say('rejected', 'Rejected in the wallet. Nothing was sent.');
  };

  const approve = async () => {
    const id = `0x${await sha256(JSON.stringify({ ...TRANSFER, nonce: state.nonce }))}`;
    setState({ phase: 'pending', id });
    say(
      'pending',
      `Signed as ${short(id)}. In the mempool, not in a block yet.`,
    );
    pulse();
    drain();
  };

  return {
    blocks,
    log,
    state,
    setState,
    depth,
    moving,
    ready,
    mine,
    drain,
    send,
    reject,
    approve,
  };
};
