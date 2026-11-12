import {
  createContext,
  createElement as h,
  memo,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Demo } from '../types/interfaces';
import { clamp } from './format';
import {
  fitCanvas,
  pixelRatio,
  setReadout,
  skin,
  still,
  tally,
} from './session';

const FLASH_MS = 340;
const LONG_AGO = -1e9;

const ms = (value: number) =>
  value < 0.05 ? '<0.1 ms' : `${value.toFixed(1)} ms`;

// real React 18: one grid reads Context, the other subscribes to a single slice of an external store
export function initDemo(root: HTMLElement): Demo {
  const [gridNaive, gridSelected] =
    root.querySelectorAll<HTMLElement>('.cells');
  const [canvasNaive, canvasSelected] = root.querySelectorAll('canvas');
  const penNaive = canvasNaive.getContext('2d');
  const penSelected = canvasSelected.getContext('2d');
  const rootNaive = createRoot(gridNaive);
  const rootSelected = createRoot(gridSelected);
  const state = {
    cols: 0,
    rows: 0,
    n: 0,
    gap: 1,
    dpr: 1,
    now: LONG_AGO,
    hot: -1,
    pending: -1,
    manual: false,
    visible: false,
    renders: [0, 0],
    per: [0, 0],
    took: [0, 0],
    all: [0, 0],
    seen: [new Float64Array(0), new Float64Array(0)],
  };

  const Hot = createContext(-1);
  const subscribers = new Set<() => void>();
  const store = {
    hot: -1,
    subscribe(notify: () => void) {
      subscribers.add(notify);
      return () => subscribers.delete(notify);
    },
    set(value: number) {
      store.hot = value;
      for (const notify of subscribers) notify();
    },
  };
  const mark = (side: number, i: number) => {
    state.seen[side][i] = state.now;
    state.renders[side]++;
  };
  const NaiveCell = memo(({ i }: { i: number }) => {
    const hot = useContext(Hot);
    mark(0, i);
    return h('i', { className: hot === i ? 'hot' : undefined });
  });
  const SelectedCell = memo(({ i }: { i: number }) => {
    const on = useSyncExternalStore(store.subscribe, () => store.hot === i);
    mark(1, i);
    return h('i', { className: on ? 'hot' : undefined });
  });
  let setNaive: (value: number) => void = () => {};
  const NaiveGrid = ({ n }: { n: number }) => {
    const [hot, set] = useState(-1);
    setNaive = set;
    const cells = useMemo(
      () => Array.from({ length: n }, (_, i) => h(NaiveCell, { key: i, i })),
      [n],
    );
    return h(Hot.Provider, { value: hot }, cells);
  };
  const SelectedGrid = ({ n }: { n: number }) =>
    useMemo(
      () => Array.from({ length: n }, (_, i) => h(SelectedCell, { key: i, i })),
      [n],
    );

  const fit = () => {
    state.dpr = pixelRatio();
    for (const canvas of [canvasNaive, canvasSelected]) fitCanvas(canvas);
  };

  const size = (cols: number, rows: number) => {
    Object.assign(state, {
      cols,
      rows,
      n: cols * rows,
      gap: cols > 80 ? 0 : 1,
      now: LONG_AGO,
      hot: -1,
    });
    store.hot = -1;
    for (const grid of [gridNaive, gridSelected]) {
      grid.style.setProperty('--cols', String(cols));
      grid.style.setProperty('--rows', String(rows));
      grid.style.setProperty('--gap', `${state.gap}px`);
    }
    state.seen = [new Float64Array(state.n), new Float64Array(state.n)];
    flushSync(() => {
      rootNaive.render(h(NaiveGrid, { n: state.n }));
      rootSelected.render(h(SelectedGrid, { n: state.n }));
    });
    flushSync(() => setNaive(-1));
    for (const seen of state.seen) seen.fill(LONG_AGO);
    state.per = [0, 0];
    state.took = [0, 0];
    fit();
  };

  const update = (next: number) => {
    if (next === state.hot || next < 0 || next >= state.n) return;
    state.hot = next;
    state.now = performance.now();
    state.renders = [0, 0];
    const commits = [() => setNaive(next), () => store.set(next)];
    commits.forEach((commit, side) => {
      const start = performance.now();
      flushSync(commit);
      const took = performance.now() - start;
      state.took[side] = state.took[side]
        ? state.took[side] * 0.92 + took * 0.08
        : took;
      state.per[side] = state.renders[side];
      state.all[side] += state.renders[side];
    });
    tally.naive += state.renders[0];
    tally.selected += state.renders[1];
  };

  const paint = (
    pen: CanvasRenderingContext2D | null,
    canvas: HTMLCanvasElement,
    seen: Float64Array,
    now: number,
  ) => {
    if (!pen) return;
    const gap = state.gap * state.dpr;
    const cw = (canvas.width - (state.cols - 1) * gap) / state.cols;
    const ch = (canvas.height - (state.rows - 1) * gap) / state.rows;
    const left = (i: number) => (i % state.cols) * (cw + gap);
    const top = (i: number) => ((i / state.cols) | 0) * (ch + gap);
    pen.clearRect(0, 0, canvas.width, canvas.height);
    pen.fillStyle = skin.ember;
    for (let i = 0; i < state.n; i++) {
      const age = now - seen[i];
      if (age >= FLASH_MS) continue;
      pen.globalAlpha = (1 - age / FLASH_MS) * 0.9;
      pen.fillRect(left(i), top(i), cw, ch);
    }
    if (state.hot < 0) return;
    pen.globalAlpha = 1;
    pen.fillStyle = skin.ice;
    pen.fillRect(
      left(state.hot),
      top(state.hot),
      Math.max(cw, 2 * state.dpr),
      Math.max(ch, 2 * state.dpr),
    );
  };

  const tick = (now: number) => {
    if (!state.visible) return;
    if (state.manual) update(state.pending);
    else if (!still()) {
      const t = now / 1000;
      update(
        Math.round((Math.sin(t * 1.1) * 0.5 + 0.5) * (state.rows - 1)) *
          state.cols +
          Math.round((Math.sin(t * 1.7 + 1) * 0.5 + 0.5) * (state.cols - 1)),
      );
    }
    paint(penNaive, canvasNaive, state.seen[0], now);
    paint(penSelected, canvasSelected, state.seen[1], now);
  };

  const report = () =>
    setReadout('demo', {
      perNaive: state.per[0],
      perSelected: state.per[1],
      msNaive: ms(state.took[0]),
      msSelected: ms(state.took[1]),
      allNaive: state.all[0],
      allSelected: state.all[1],
    });

  for (const grid of [gridNaive, gridSelected]) {
    grid.addEventListener('pointermove', (event) => {
      const r = grid.getBoundingClientRect();
      const row = (((event.clientY - r.top) / r.height) * state.rows) | 0;
      const col = (((event.clientX - r.left) / r.width) * state.cols) | 0;
      state.manual = true;
      state.pending =
        clamp(row, 0, state.rows - 1) * state.cols +
        clamp(col, 0, state.cols - 1);
    });
    grid.addEventListener('pointerleave', () => {
      state.manual = false;
    });
  }
  new IntersectionObserver(
    ([entry]) => {
      state.visible = entry.isIntersecting;
    },
    { threshold: 0.05 },
  ).observe(root);

  return { fit, size, tick, report };
}
