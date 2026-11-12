import { For, Index, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { KEYS, KPIS, LAST, MONTH_STARTS, SUMMARY } from '../constants/calendar';
import { hrefOf, kindOf, noteFor, privateNote, sourceOf } from '../utils/day';
import {
  clamp,
  fmt,
  longDate,
  plural,
  shortDate,
  shortMonth,
} from '../utils/format';
import {
  counts,
  dayAt,
  fullestPublicDay,
  level,
  nearestPublicDay,
  stats,
} from '../utils/stats';

const Calendar = () => {
  const [day, setDay] = createSignal(fullestPublicDay);
  const [seen, setSeen] = createSignal(false);
  const cells: HTMLButtonElement[] = [];
  let scroller!: HTMLDivElement;
  let heat!: HTMLDivElement;

  const items = () => stats.days[day()] ?? [];
  const hidden = () => Math.max(0, counts[day()] - items().length);
  const nearest = () => nearestPublicDay(day());

  const show = (next: number) => setDay(clamp(next, 0, LAST));
  const jump = (next: number) => {
    show(next);
    cells[day()].scrollIntoView({ block: 'nearest', inline: 'center' });
  };
  const step = (by: number) => jump(day() + by);
  const toNearest = () => jump(nearest());
  const onKey = (event: KeyboardEvent) => {
    const by = KEYS[event.key];
    if (!by) return;
    event.preventDefault();
    show(day() + by);
    cells[day()].focus();
  };

  onMount(() => {
    scroller.scrollLeft = scroller.scrollWidth;
    const visible = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        visible.disconnect();
      },
      { threshold: 0.3 },
    );
    visible.observe(heat);
    onCleanup(() => visible.disconnect());
  });

  return (
    <div class="pane cal">
      <div class="calscroll" id="calscroll" ref={scroller}>
        <div class="months" aria-hidden="true">
          <For each={MONTH_STARTS}>
            {(week) => (
              <span style={{ 'grid-column': week + 1 }}>
                {shortMonth(dayAt(week * 7))}
              </span>
            )}
          </For>
        </div>
        <div
          class="heat"
          classList={{ in: seen() }}
          ref={heat}
          role="group"
          aria-label={SUMMARY}
          onKeyDown={onKey}
        >
          <Index each={counts}>
            {(count, i) => (
              <button
                type="button"
                ref={(el) => {
                  cells[i] = el;
                }}
                tabindex={day() === i ? 0 : -1}
                data-l={level(count())}
                data-p={stats.days[i] ? '' : undefined}
                style={{ '--c': (i / 7) | 0 }}
                aria-pressed={day() === i}
                aria-label={`${plural(count(), 'contribution')} on ${longDate(dayAt(i))}`}
                onClick={[show, i]}
              />
            )}
          </Index>
        </div>
      </div>
      <p class="calkey">
        <span>Every day opens.</span>
        <span>
          <i class="pub" />
          Round: public work, with links to GitHub
        </span>
        <span>
          <i />
          Square: private work, count only
        </span>
      </p>
      <div class="dayp">
        <div class="dayh" aria-live="polite">
          <time>{longDate(dayAt(day()))}</time>
          <b>{plural(counts[day()], 'contribution')}</b>
          <p>{noteFor(day())}</p>
          <div class="dnav">
            <button type="button" disabled={!day()} onClick={[step, -1]}>
              ← day before
            </button>
            <button type="button" disabled={day() === LAST} onClick={[step, 1]}>
              day after →
            </button>
          </div>
        </div>
        <ul class="dayl">
          <For each={items()}>
            {(item) => (
              <li>
                <span>{kindOf(item)}</span>
                <div>
                  <a href={hrefOf(item)}>{item[3]}</a>
                  <small>{sourceOf(item)}</small>
                </div>
              </li>
            )}
          </For>
          <li class="priv">
            <Show
              when={items().length}
              fallback={
                <>
                  {privateNote(counts[day()])}
                  <div class="dnav">
                    <button type="button" onClick={toNearest}>
                      Nearest day with public work:{' '}
                      {shortDate(dayAt(nearest()))} →
                    </button>
                  </div>
                </>
              }
            >
              <Show when={hidden()}>
                Plus {fmt(hidden())} more, in private repositories or as
                reviews.
              </Show>
            </Show>
          </li>
        </ul>
      </div>
      <dl class="kpis">
        <For each={KPIS}>
          {(kpi) => (
            <div>
              <dt>{kpi.label}</dt>
              <dd>{fmt(kpi.value)}</dd>
            </div>
          )}
        </For>
      </dl>
    </div>
  );
};

export default Calendar;
