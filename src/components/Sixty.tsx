import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { DEMO_SIZES, SELECTOR_REPO, TALK } from '../constants/site';
import { fmt } from '../utils/format';
import { engine, readout } from '../utils/session';

const START = 1;

const Sixty = () => {
  const [size, setSize] = createSignal(START);
  const [failed, setFailed] = createSignal(false);
  let demo!: HTMLDivElement;

  const pick = (index: number) => {
    setSize(index);
    engine.demo?.size(DEMO_SIZES[index].cols, DEMO_SIZES[index].rows);
  };

  // React only downloads once the demo is about to be seen
  onMount(() => {
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import('../utils/reactDemo')
          .then(({ initDemo }) => {
            engine.demo = initDemo(demo);
            pick(size());
          })
          .catch((error) => {
            console.error(error);
            setFailed(true);
          });
      },
      { rootMargin: '900px' },
    );
    near.observe(demo);
    onCleanup(() => near.disconnect());
  });

  return (
    <section class="act wrap" id="sixty" aria-labelledby="sixty-h">
      <div class="duo">
        <div class="slot num" id="s2" aria-hidden="true">
          60
        </div>
        <div>
          <h2 id="sixty-h">
            <span class="sr">60 </span>frames per second, or it isn't finished.
          </h2>
          <p class="body">
            Both grids below are real React 18 with the same data and the same
            update. The left one reads Context the usual way. The right one
            subscribes to a single slice, the idea behind my{' '}
            <a href={SELECTOR_REPO}>context-selector</a> library and my{' '}
            <a href={TALK}>React Conf Brasil 2021 talk</a>. Hover a grid, pick a
            bigger size, and watch the meter.
          </p>
        </div>
      </div>
      <div id="demo" ref={demo} hidden={failed()}>
        <div class="dctl">
          <span id="demo-size">components per grid</span>
          <For each={DEMO_SIZES}>
            {(option, i) => (
              <button
                type="button"
                class="seg"
                aria-pressed={size() === i()}
                aria-describedby="demo-size"
                onClick={[pick, i()]}
              >
                {fmt(option.cols * option.rows)}
              </button>
            )}
          </For>
        </div>
        <div class="demo">
          <div class="pane">
            <h3>useContext</h3>
            <p class="sub">One value changes. Every consumer renders.</p>
            <div class="gridbox">
              <div class="cells" aria-hidden="true" />
              <canvas aria-hidden="true" />
            </div>
            <dl class="stats bad">
              <div>
                <dt>renders / update</dt>
                <dd>{fmt(readout.demo.perNaive)}</dd>
              </div>
              <div>
                <dt>update time</dt>
                <dd>{readout.demo.msNaive}</dd>
              </div>
              <div>
                <dt>total renders</dt>
                <dd>{fmt(readout.demo.allNaive)}</dd>
              </div>
            </dl>
          </div>
          <div class="pane">
            <h3>selector</h3>
            <p class="sub">Same change. Only the cells that read it render.</p>
            <div class="gridbox">
              <div class="cells" aria-hidden="true" />
              <canvas aria-hidden="true" />
            </div>
            <dl class="stats good">
              <div>
                <dt>renders / update</dt>
                <dd>{fmt(readout.demo.perSelected)}</dd>
              </div>
              <div>
                <dt>update time</dt>
                <dd>{readout.demo.msSelected}</dd>
              </div>
              <div>
                <dt>total renders</dt>
                <dd>{fmt(readout.demo.allSelected)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <p class="body after">
        Orange is a component rendering. The next section is the tool I wrote to
        stop that before it ships.
      </p>
    </section>
  );
};

export default Sixty;
