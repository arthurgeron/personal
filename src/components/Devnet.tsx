import {
  For,
  Show,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from 'solid-js';
import {
  BLOCK_MS,
  COST,
  DEPTHS,
  FAULTS,
  STRIP,
  TRANSFER,
} from '../constants/devnet';
import { createDevnet, eth, short } from '../utils/devnet';
import { still } from '../utils/session';

const Devnet = () => {
  const net = createDevnet();
  const { state } = net;
  const [visible, setVisible] = createSignal(false);
  let panel!: HTMLDivElement;
  let strip!: HTMLOListElement;
  let sendButton!: HTMLButtonElement;
  let approveButton!: HTMLButtonElement;

  onMount(() => {
    for (let seeded = 1; seeded < STRIP; seeded++) net.mine();
    const watch = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    watch.observe(panel);
    onCleanup(() => watch.disconnect());
  });

  createEffect(() => {
    if (!visible()) return;
    if (still()) return void net.drain();
    const timer = setInterval(net.mine, BLOCK_MS);
    onCleanup(() => clearInterval(timer));
  });

  createEffect(
    on(
      net.blocks,
      () => {
        if (visible() && !still())
          strip.animate(
            [{ transform: 'translateX(var(--step))' }, { transform: 'none' }],
            { duration: 420, easing: 'cubic-bezier(.2, .8, .2, 1)' },
          );
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => state.phase,
      (phase, before) => {
        if (phase === 'signing') approveButton.focus();
        else if (before === 'signing') sendButton.focus();
      },
      { defer: true },
    ),
  );

  return (
    <div class="devnet" ref={panel}>
      <p class="eyebrow">
        A chain running in this tab · one block every 2 seconds · every hash is
        a real SHA-256 over its parent
      </p>
      <div class="chain">
        <div class="pool">
          <span>mempool</span>
          <Show when={state.phase === 'pending'} fallback={<i>empty</i>}>
            <b class="chip">{short(state.id)}</b>
          </Show>
        </div>
        <div class="strip">
          <ol class="blocks" ref={strip} aria-label="Latest blocks">
            <For each={net.blocks()}>
              {(block) => (
                <li classList={{ orphan: block.orphan, has: !!block.tx }}>
                  <b>#{block.height}</b>
                  <code>{block.hash.slice(0, 8)}</code>
                  <Show when={block.tx}>
                    <span class="chip">{short(block.tx)}</span>
                  </Show>
                  <Show when={block.orphan}>
                    <em>orphaned</em>
                  </Show>
                  <Show
                    when={
                      !block.orphan &&
                      block.height === state.block &&
                      (state.phase === 'included' || state.phase === 'final')
                    }
                  >
                    <span class="pips" aria-hidden="true">
                      <For each={DEPTHS}>
                        {(pip) => <i classList={{ on: pip <= net.depth() }} />}
                      </For>
                    </span>
                  </Show>
                </li>
              )}
            </For>
          </ol>
        </div>
      </div>
      <div class="desk">
        <div class="wallet">
          <button
            class="btn"
            type="button"
            ref={sendButton}
            aria-disabled={!net.ready()}
            onClick={net.send}
          >
            Send a test transaction
          </button>
          <fieldset class="faults">
            <legend>Break it on the way</legend>
            <For each={FAULTS}>
              {(fault) => (
                <label>
                  <input
                    type="checkbox"
                    checked={state[fault.key]}
                    onChange={(event) =>
                      net.setState(fault.key, event.currentTarget.checked)
                    }
                  />
                  {fault.label}
                </label>
              )}
            </For>
          </fieldset>
          <p class="bal">
            Balance <b>{eth(state.balance)}</b>
            <Show when={net.moving()}>
              <span>{eth(COST)} leaving, not final</span>
            </Show>
          </p>
          <Show when={state.phase === 'signing'}>
            <div class="sheet" role="group" aria-label="Signature request">
              <dl>
                <dt>transfer</dt>
                <dd>{eth(TRANSFER.amount)}</dd>
                <dt>to</dt>
                <dd>{TRANSFER.to}</dd>
                <dt>max fee</dt>
                <dd>{eth(TRANSFER.fee)}</dd>
                <dt>nonce</dt>
                <dd>{state.nonce}</dd>
              </dl>
              <button
                class="btn"
                type="button"
                ref={approveButton}
                onClick={net.approve}
              >
                Approve
              </button>
              <button class="btn quiet" type="button" onClick={net.reject}>
                Reject
              </button>
            </div>
          </Show>
        </div>
        <ol class="txlog" role="log" aria-label="Transaction status">
          <For each={net.log()}>
            {(line) => (
              <li data-s={line.label}>
                <b>{line.label}</b>
                {line.text}
              </li>
            )}
          </For>
        </ol>
      </div>
    </div>
  );
};

export default Devnet;
