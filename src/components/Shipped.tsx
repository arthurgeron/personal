import { For, Show } from 'solid-js';
import { MERGED_INTO, WORKED_AT } from '../constants/site';
import type { Company } from '../types/interfaces';
import { stats } from '../utils/stats';

const COPIES = [0, 1, 2];

const Track = (props: { items: Company[]; reverse?: boolean }) => (
  <div class="mq" classList={{ rev: props.reverse }}>
    <For each={COPIES}>
      {(copy) => (
        <div aria-hidden={copy ? 'true' : undefined}>
          <For each={props.items}>
            {(item) => (
              <p>
                <Show when={item.tag}>
                  <i aria-hidden="true">{item.tag}</i>
                </Show>
                <span>
                  <b>{item.name}</b> <small>{item.note}</small>
                </span>
              </p>
            )}
          </For>
        </div>
      )}
    </For>
  </div>
);

const Shipped = () => (
  <section class="ship" id="ship" aria-labelledby="ship-h">
    <div class="wrap ship-head">
      <div>
        <h2 id="ship-h">I have shipped for teams you already know.</h2>
        <p class="body">
          Thirteen years across product companies, client engagements and open
          source. The first row is where I worked. The second is whose code I
          fixed.
        </p>
      </div>
      <div>
        <p class="big">{stats.codebases}</p>
        <p>public codebases with my code merged</p>
      </div>
    </div>
    <p class="wrap mql">Worked at and for</p>
    <Track items={WORKED_AT} />
    <p class="wrap mql">Merged upstream</p>
    <Track items={MERGED_INTO} reverse />
  </section>
);

export default Shipped;
