import { For } from 'solid-js';
import { PLUGIN, PLUGIN_REPO, UPSTREAM, upstreamHref } from '../constants/site';
import { fmt, fullDate } from '../utils/format';
import { fetchedOn, stats, total } from '../utils/stats';
import Calendar from './Calendar';
import LintDemo from './LintDemo';

const PLUGIN_KPIS = [
  { label: 'npm downloads last week', value: stats.plugin.weekly },
  { label: 'last 12 months', value: stats.plugin.yearly },
  { label: 'public repos depending on it', value: stats.plugin.dependents },
  { label: 'releases shipped', value: stats.plugin.releases },
];

const OpenSource = () => (
  <section class="act wrap" id="oss" aria-labelledby="oss-h">
    <div class="duo">
      <div class="slot num w3" id="s5" aria-hidden="true">
        {fmt(total)}
      </div>
      <div>
        <h2 id="oss-h">
          <span class="sr">{fmt(total)} </span>contributions on GitHub in the
          last year.
        </h2>
        <p class="body">
          Read from my public GitHub profile on {fullDate(fetchedOn)}. Most of
          it is private product work. Select any day to see what it held.
        </p>
      </div>
    </div>
    <Calendar />
    <div class="oss">
      <div class="pane">
        <h3 class="pk">
          <a href={PLUGIN_REPO}>{PLUGIN}</a>
        </h3>
        <p class="sub">
          An ESLint plugin I wrote in 2022. It catches the left grid's problem
          in your editor, then fixes it.
        </p>
        <dl class="kpis">
          <For each={PLUGIN_KPIS}>
            {(kpi) => (
              <div>
                <dt>{kpi.label}</dt>
                <dd>{fmt(kpi.value)}</dd>
              </div>
            )}
          </For>
        </dl>
        <LintDemo />
      </div>
      <div class="pane">
        <h3>Merged upstream</h3>
        <p class="sub">Each row opens the merged pull requests on GitHub.</p>
        <ul class="up">
          <For each={UPSTREAM}>
            {(item) => (
              <li>
                <a href={upstreamHref(item)}>
                  <b>{item.name}</b>
                  <span>{item.repo}</span>
                  <p>{item.what}</p>
                </a>
              </li>
            )}
          </For>
        </ul>
        <p class="more">
          The rest include Blueprint Finance's public docs and five pull
          requests into a Garry's Mod zombie survival gamemode.
        </p>
      </div>
    </div>
  </section>
);

export default OpenSource;
