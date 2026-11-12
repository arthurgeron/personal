import { onCleanup, onMount } from 'solid-js';
import { initGlyphs } from './glyphs';
import { startLoop } from './loop';
import {
  engine,
  fitCanvas,
  isSmall,
  pointer,
  readSkin,
  setContrast,
  setCount,
  setCountUp,
  setGlNote,
  setLight,
  setMaxGlyphs,
  setStill,
  still,
  tally,
  wave,
} from './session';

const FONT_WAIT_MS = 2500;
const RESIZE_SETTLE_MS = 200;
const INTERACTIVE = 'button,a,input,dialog,#hud,.cells,.code';

const fontsReady = () =>
  Promise.race([
    Promise.all([
      document.fonts.load('800 100px Geist'),
      document.fonts.load('600 50px "Geist Mono"'),
    ]),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
  ]).catch(() => {});

export function useEngine() {
  onMount(() => {
    const root = document.documentElement;
    const canvas = document.getElementById('gl') as HTMLCanvasElement;
    const spark = document.getElementById('spark') as HTMLCanvasElement;
    const small = isSmall();
    const off = new AbortController();
    const listen = { signal: off.signal, passive: true };
    let stopLoop = () => {};
    let settle = 0;
    let lastWidth = innerWidth;
    let lastHeight = 0;
    let lastY = scrollY;

    const dead = (message: string) => {
      engine.glyphs = null;
      for (const slot of document.querySelectorAll<HTMLElement>('.slot'))
        slot.style.aspectRatio = '';
      root.classList.replace('gl', 'nogl');
      canvas.hidden = true;
      setGlNote(message);
    };

    setStill(matchMedia('(prefers-reduced-motion: reduce)').matches);
    setLight(root.classList.contains('light'));
    setContrast(root.classList.contains('contrast'));
    setMaxGlyphs(small ? 200_000 : 1_000_000);
    setCount(small ? 7000 : 30_000);
    readSkin();
    root.classList.add('gl');
    try {
      engine.glyphs = initGlyphs(canvas, dead);
    } catch (error) {
      console.error(error);
    }
    if (!engine.glyphs)
      dead('WebGL2 is unavailable here, so the code rain is off.');

    const relayout = (full: boolean) => {
      fitCanvas(spark);
      engine.demo?.fit();
      engine.glyphs?.fit();
      if (full) engine.glyphs?.build();
      else engine.glyphs?.place();
    };
    // a change in page height moves every slot, so the words are rebuilt
    const onResize = () => {
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        const height = root.scrollHeight;
        const full =
          innerWidth !== lastWidth || Math.abs(height - lastHeight) > 8;
        lastWidth = innerWidth;
        lastHeight = height;
        relayout(full);
      }, RESIZE_SETTLE_MS);
    };

    window.addEventListener(
      'pointermove',
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        if (pointer.on) return;
        pointer.on = true;
        pointer.sx = pointer.x;
        pointer.sy = pointer.y;
      },
      listen,
    );
    root.addEventListener(
      'pointerleave',
      () => {
        pointer.on = false;
      },
      listen,
    );
    window.addEventListener(
      'pointerup',
      (event) => {
        if (event.pointerType !== 'mouse') pointer.on = false;
      },
      listen,
    );
    window.addEventListener(
      'pointerdown',
      (event) => {
        if (!(event.target as Element).closest?.(INTERACTIVE))
          wave(event.clientX, event.clientY + scrollY, 1);
      },
      listen,
    );
    window.addEventListener(
      'scroll',
      () => {
        tally.scroll += Math.abs(scrollY - lastY);
        lastY = scrollY;
      },
      listen,
    );

    const resizes = new ResizeObserver(onResize);
    fontsReady().then(() => {
      if (off.signal.aborted) return;
      relayout(true);
      if (engine.glyphs) setCount(engine.glyphs.def);
      lastHeight = root.scrollHeight;
      tally.t0 = performance.now();
      if (!still()) setCountUp(0);
      root.classList.add('ready');
      window.addEventListener('resize', onResize, listen);
      resizes.observe(document.body);
      stopLoop = startLoop(spark);
    });

    onCleanup(() => {
      off.abort();
      resizes.disconnect();
      clearTimeout(settle);
      stopLoop();
    });
  });
}
