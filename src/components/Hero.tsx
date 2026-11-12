import { For } from 'solid-js';
import { HINTS, NAV } from '../constants/site';
import { fmt } from '../utils/format';
import { count, countUp, maxGlyphs } from '../utils/session';
import { stats, total } from '../utils/stats';

const PROOF = [
  { label: 'years building frontends', value: () => 13 },
  { label: 'contributions on GitHub in the last year', value: () => total },
  {
    label: 'npm downloads of my ESLint plugin in the last 12 months',
    value: () => stats.plugin.yearly,
  },
  {
    label: 'characters of code this page will draw if you ask it to',
    value: maxGlyphs,
  },
];

const Hero = () => (
  <header class="hero wrap" id="top">
    <nav class="topnav" aria-label="Sections">
      <b>AG</b>
      <For each={NAV}>{(item) => <a href={item.href}>{item.label}</a>}</For>
    </nav>
    <p class="eyebrow">
      Frontend engineer · 13 years · React, React Native, Web3
    </p>
    <h1 class="slot" id="s0" data-stack>
      Arthur Geron
    </h1>
    <div class="hero-foot">
      <p class="lead">
        I make browsers do hard things at <em>sixty frames per second</em>. This
        page is the demo.
      </p>
      <div>
        <p class="note">
          My last site had 150 particles. This one rains <b>{fmt(count())}</b>{' '}
          characters of code on the same frame budget, and every one is placed
          on the GPU in a single draw call. The meter in the corner is measuring
          this page right now.
        </p>
        <div class="hint" aria-hidden="true">
          <For each={HINTS}>{(hint) => <span>{hint}</span>}</For>
        </div>
      </div>
    </div>
    <dl class="proof">
      <For each={PROOF}>
        {(item) => (
          <div>
            <dt>{item.label}</dt>
            <dd data-n>{fmt(item.value() * countUp())}</dd>
          </div>
        )}
      </For>
    </dl>
  </header>
);

export default Hero;
