import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { CAREER, ERAS } from '../constants/career';
import { scrollBehavior, still } from '../utils/session';

const DIP_MS = 210;

const Years = () => {
  const [active, setActive] = createSignal(0);
  const [shown, setShown] = createSignal(0);
  const [live, setLive] = createSignal(false);
  const rows: HTMLLIElement[] = [];
  let card!: HTMLDivElement;
  let swap = 0;

  // the box morphs straight away, and the type changes while the text is dipped out
  const activate = (index: number) => {
    if (index === active()) return;
    setActive(index);
    clearTimeout(swap);
    if (still()) {
      setShown(index);
      return;
    }
    card.classList.remove('dip');
    void card.offsetWidth;
    card.classList.add('dip');
    swap = window.setTimeout(() => setShown(index), DIP_MS);
  };

  const jumpTo = (era: number) =>
    rows[CAREER.findIndex((row) => row.era === era)]?.scrollIntoView({
      block: 'center',
      behavior: scrollBehavior(),
    });

  onMount(() => {
    const reading = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).pop();
        if (hit) activate(rows.indexOf(hit.target as HTMLLIElement));
      },
      { rootMargin: '-55% 0px -45% 0px' },
    );
    for (const row of rows) reading.observe(row);
    const visible = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.35 },
    );
    visible.observe(card);
    onCleanup(() => {
      reading.disconnect();
      visible.disconnect();
      clearTimeout(swap);
    });
  });

  return (
    <section class="act wrap" id="years" aria-labelledby="years-h">
      <div class="duo">
        <div class="slot num" id="s1" aria-hidden="true">
          13
        </div>
        <div>
          <h2 id="years-h">
            <span class="sr">13 </span>years of frontend, and every trend that
            came with them.
          </h2>
          <p class="body">
            Scroll back through them. Each row is what I was shipping, and the
            card that follows you is restyled the way we all swore was the
            future that year.
          </p>
        </div>
      </div>
      <div class="story">
        <div
          class="era"
          classList={{ live: live() }}
          ref={card}
          data-era={CAREER[active()].era}
          data-f={CAREER[shown()].era}
          aria-hidden="true"
        >
          <div class="estage">
            <div class="ebg">
              <For each={ERAS}>{() => <i />}</For>
            </div>
            <span class="eyear">{CAREER[shown()].year}</span>
            <div class="ecard">
              <div class="eav">AG</div>
              <div class="eid">
                <b>Arthur Geron</b>
                <span>{CAREER[shown()].card}</span>
              </div>
              <a class="ebtn" href="#contact" tabindex="-1">
                <span>{ERAS[CAREER[shown()].era].button}</span>
              </a>
            </div>
          </div>
          <div class="ectl">
            <p class="eq">
              <small>Meanwhile, on the web</small>
              <span>{ERAS[CAREER[shown()].era].quote}</span>
            </p>
            <div class="eticks">
              <For each={ERAS}>
                {(era, i) => (
                  <button
                    type="button"
                    tabindex="-1"
                    classList={{ on: CAREER[active()].era === i() }}
                    onClick={[jumpTo, i()]}
                  >
                    {era.year}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
        <ol class="tl">
          <For each={CAREER}>
            {(row, i) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: the click is a pointer shortcut, and keyboard focus inside a row activates it through focusin
              <li
                ref={(el) => rows.push(el)}
                classList={{ on: active() === i() }}
                onClick={[activate, i()]}
                onFocusIn={[activate, i()]}
              >
                <time>{row.when}</time>
                <div>
                  <h3>
                    {row.org} <small>{row.role}</small>
                  </h3>
                  <p class="hl">{row.headline}</p>
                  <p>
                    {row.body}
                    <Show when={row.link}>
                      {(link) => (
                        <>
                          {' '}
                          <a href={link().href}>{link().label}</a>
                          {row.tail}
                        </>
                      )}
                    </Show>
                  </p>
                  <Show when={row.results}>
                    <div class="meas">
                      <For each={row.results}>
                        {(result) => (
                          <p>
                            <b>{result.figure}</b>
                            {result.text}
                          </p>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
                <Show when={row.evidence}>
                  {(evidence) => (
                    <a class="ev" href={evidence().href}>
                      {evidence().label} →
                    </a>
                  )}
                </Show>
              </li>
            )}
          </For>
        </ol>
      </div>
    </section>
  );
};

export default Years;
