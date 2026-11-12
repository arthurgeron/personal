import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Demo, Glyphs } from '../types/interfaces';
import { clamp } from './format';

export const MIN_GLYPHS = 1000;

export const tally = {
  t0: 0,
  frames: 0,
  dropped: 0,
  slow: 0,
  sum: 0,
  peak: 0,
  updates: 0,
  scroll: 0,
  naive: 0,
  selected: 0,
};

export const pointer = { x: 0, y: 0, sx: 0, sy: 0, on: false };
export const shock = { x: 0, y: 0, t: -1e9, k: 0 };
export const skin = { gold: '', ember: '', ice: '' };
export const engine: { glyphs: Glyphs | null; demo: Demo | null } = {
  glyphs: null,
  demo: null,
};

export const [maxGlyphs, setMaxGlyphs] = createSignal(1_000_000);
const [count, setCountSignal] = createSignal(30_000);
export { count };
export const [light, setLight] = createSignal(false);
export const [xray, setXray] = createSignal(false);
export const [still, setStill] = createSignal(false);
export const [contrast, setContrast] = createSignal(false);
export const [glNote, setGlNote] = createSignal<string>();
export const [countUp, setCountUp] = createSignal(1);
export const [lintFixed, setLintFixed] = createSignal(false);
export const [paletteOpen, setPaletteOpen] = createSignal(false);

export const [readout, setReadout] = createStore({
  fps: 60,
  p95: '16.7 ms',
  dropped: 0,
  time: '00:00',
  frames: 0,
  average: 60,
  slowest: '0.0 ms',
  peak: 0,
  updates: 0,
  naive: 0,
  selected: 0,
  scrolled: 0,
  demo: {
    perNaive: 0,
    perSelected: 0,
    msNaive: '0 ms',
    msSelected: '<0.1 ms',
    allNaive: 0,
    allSelected: 0,
  },
});

export const setCount = (next: number) => {
  const value = clamp(next, MIN_GLYPHS, maxGlyphs());
  tally.peak = Math.max(tally.peak, value);
  setCountSignal(value);
};

export const wave = (x: number, y: number, k: number) => {
  shock.x = x;
  shock.y = y;
  shock.t = performance.now();
  shock.k = k;
};

export const readSkin = () => {
  const css = getComputedStyle(document.documentElement);
  for (const name of ['gold', 'ember', 'ice'] as const)
    skin[name] = css.getPropertyValue(`--${name}`).trim();
};

export const remember = (key: string, value: string) => {
  try {
    localStorage[key] = value;
  } catch {}
};

export const scrollBehavior = (): ScrollBehavior =>
  still() ? 'auto' : 'smooth';

export const isSmall = () =>
  matchMedia('(pointer: coarse)').matches || innerWidth < 820;

export const pixelRatio = () => Math.min(devicePixelRatio || 1, 2);

export const fitCanvas = (canvas: HTMLCanvasElement) => {
  const dpr = pixelRatio();
  canvas.width = (canvas.clientWidth * dpr) | 0;
  canvas.height = (canvas.clientHeight * dpr) | 0;
};
