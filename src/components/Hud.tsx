import { createSignal, onCleanup, onMount } from 'solid-js';
import { toggleContrast, toggleStill, toggleXray } from '../utils/actions';
import { fmt } from '../utils/format';
import {
  MIN_GLYPHS,
  contrast,
  count,
  fitCanvas,
  glNote,
  isSmall,
  light,
  maxGlyphs,
  readout,
  setCount,
  setPaletteOpen,
  still,
  xray,
} from '../utils/session';
import { toggleTheme } from '../utils/theme';

const AUTO_OPEN_ABOVE = 160;

const toCount = (slider: number) =>
  Math.round(
    (MIN_GLYPHS * (maxGlyphs() / MIN_GLYPHS) ** (slider / 100)) / 1000,
  ) * 1000;

const toSlider = (glyphs: number) =>
  Math.round(
    (Math.log(glyphs / MIN_GLYPHS) / Math.log(maxGlyphs() / MIN_GLYPHS)) * 100,
  );

const short = (glyphs: number) =>
  glyphs >= 1e6 ? '1M' : `${Math.round(glyphs / 1000)}k`;

const quip = () => {
  const note = glNote();
  if (note) return note;
  if (readout.fps < 45 && count() > 300_000)
    return "You found your GPU's limit. The code is still one draw call.";
  if (count() >= maxGlyphs())
    return `${fmt(maxGlyphs())} glyphs, one draw call, zero JavaScript per glyph.`;
  if (count() >= 500_000) return 'Half a million and still bored.';
  if (count() <= 5000) return 'Easy mode. Slide right.';
  return 'Slide right. See what your GPU has.';
};

const Hud = () => {
  const [open, setOpen] = createSignal(true);
  const [away, setAway] = createSignal(false);
  let hud!: HTMLElement;
  let spark!: HTMLCanvasElement;
  let pinned = false;

  const show = (next: boolean) => {
    setOpen(next);
    fitCanvas(spark);
  };
  const toggle = () => {
    pinned = true;
    show(!open());
  };
  const onTheme = (event: MouseEvent) =>
    toggleTheme(event.clientX || innerWidth - 40, event.clientY || 40);

  onMount(() => {
    const small = isSmall();
    const calendar = document.getElementById('calscroll');
    let lastY = scrollY;
    let goingDown = false;
    // the collapsed badge steps aside on the way down on phones, and anywhere it would cover the calendar
    const onScroll = () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (dy) goingDown = dy > 0;
      if (!open() && calendar) {
        const badge = hud.getBoundingClientRect();
        const grid = calendar.getBoundingClientRect();
        setAway(
          (small && goingDown && scrollY > AUTO_OPEN_ABOVE) ||
            (grid.top < badge.bottom &&
              grid.bottom > badge.top &&
              grid.right > badge.left),
        );
      }
      if (pinned || small) return;
      const wanted = scrollY < AUTO_OPEN_ABOVE;
      if (wanted !== open()) show(wanted);
    };
    show(!small);
    addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => removeEventListener('scroll', onScroll));
  });

  return (
    <aside
      id="hud"
      ref={hud}
      classList={{ min: !open(), away: away() && !open() }}
      aria-label="Live performance of this page"
    >
      <button
        id="hudb"
        type="button"
        aria-expanded={open()}
        aria-controls="hudp"
        title="Live frame rate of this page"
        onClick={toggle}
      >
        <b id="fps">{readout.fps}</b>
        <span>fps</span>
        <canvas id="spark" ref={spark} aria-hidden="true" />
        <span id="cnt">{short(count())}</span>
      </button>
      <div id="hudp" hidden={!open()}>
        <div class="hrow">
          <span>p95 frame</span>
          <b>{readout.p95}</b>
        </div>
        <div class="hrow">
          <span>dropped</span>
          <b>{fmt(readout.dropped)}</b>
        </div>
        <div class="hrow">
          <label for="pc">glyphs</label>
          <b>{fmt(count())}</b>
        </div>
        <input
          id="pc"
          type="range"
          min="0"
          max="100"
          step="1"
          value={toSlider(count())}
          aria-valuetext={`${fmt(count())} glyphs`}
          onInput={(event) => setCount(toCount(+event.currentTarget.value))}
        />
        <p id="quip">{quip()}</p>
        <div class="hbtns">
          <button
            type="button"
            aria-label={`Switch to ${light() ? 'dark' : 'light'} theme`}
            onClick={onTheme}
          >
            Theme
          </button>
          <button type="button" aria-pressed={xray()} onClick={toggleXray}>
            X-ray
          </button>
          <button
            type="button"
            aria-label="Pause motion"
            aria-pressed={still()}
            onClick={toggleStill}
          >
            Pause
          </button>
          <button
            type="button"
            aria-label="More contrast"
            aria-pressed={contrast()}
            onClick={toggleContrast}
          >
            Contrast
          </button>
          <button
            type="button"
            aria-label="Open the command palette"
            onClick={[setPaletteOpen, true]}
          >
            ⌘K
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Hud;
