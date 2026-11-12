import { For } from 'solid-js';
import { SERVICES } from '../constants/site';

const Hire = () => (
  <section class="act wrap" id="hire" aria-labelledby="hire-h">
    <p class="eyebrow">Consulting</p>
    <h2 id="hire-h" class="tight">
      Bring me in when
    </h2>
    <ul class="when">
      <For each={SERVICES}>
        {(item) => (
          <li>
            <b>{item.when}</b>
            <span>{item.service}</span>
          </li>
        )}
      </For>
    </ul>
  </section>
);

export default Hire;
