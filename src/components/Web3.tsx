import { For, createSignal, onCleanup } from 'solid-js';
import { TX_IDLE } from '../constants/site';
import { engine, still, wave } from '../utils/session';

const STEPS = [0, 1, 2, 3];
const FIRST_BLOCK = 128;

const Web3 = () => {
  const [stage, setStage] = createSignal(-1);
  const [status, setStatus] = createSignal(TX_IDLE);
  const [busy, setBusy] = createSignal(false);
  const timers: number[] = [];
  let block = FIRST_BLOCK;

  const at = (ms: number, next: number, message: () => string) =>
    timers.push(
      window.setTimeout(
        () => {
          setStage(next);
          setStatus(message());
          if (next === 1) {
            const origin = engine.glyphs?.anchor('s3');
            if (origin) wave(...origin, 1.6);
          }
          if (next === 3) setBusy(false);
        },
        still() ? 0 : ms,
      ),
    );

  const send = () => {
    setBusy(true);
    setStage(0);
    setStatus('Waiting for your signature');
    at(900, 1, () => 'Signed. Pending in the mempool');
    at(2300, 2, () => `Included in block ${++block}. 1 of 3 confirmations`);
    at(3500, 3, () => `Final in block ${block}. Simulated devnet.`);
  };

  onCleanup(() => timers.forEach(clearTimeout));

  return (
    <section class="act wrap" id="web3" aria-labelledby="web3-h">
      <div class="duo2">
        <div>
          <p class="eyebrow">Web3 · Fuel Network and Concrete</p>
          <h2 id="web3-h" class="tight">
            Interfaces that tell the truth about a slow chain.
          </h2>
          <p class="body">
            A chain is slower and less certain than a server. The interface has
            to say exactly what is signed, what is pending and what is final. I
            built that into the Fuel Wallet and its connectors.
          </p>
          <div class="tx">
            <button class="btn" type="button" disabled={busy()} onClick={send}>
              Send a test transaction
            </button>
            <div class="steps" aria-hidden="true">
              <For each={STEPS}>
                {(step) => <i classList={{ on: step <= stage() }} />}
              </For>
            </div>
            <p id="txs" aria-live="polite">
              {status()}
            </p>
          </div>
        </div>
        <div
          class="slot"
          id="s3"
          data-shape="chain"
          role="img"
          aria-label="A chain of four linked blocks"
        />
      </div>
    </section>
  );
};

export default Web3;
