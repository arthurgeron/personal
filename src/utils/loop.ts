import { clamp } from './format';
import {
  count,
  countUp,
  engine,
  pointer,
  setCountUp,
  setReadout,
  skin,
  tally,
} from './session';

const BUDGET_MS = 16.7;
const REPORT_EVERY_MS = 300;
const COUNT_UP_MS = 1500;
const WARM_UP_FRAMES = 40;

const clock = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((part) => String(part | 0).padStart(2, '0'))
    .join(':');

export function startLoop(spark: HTMLCanvasElement) {
  const pen = spark.getContext('2d');
  const frames = new Float32Array(72).fill(BUDGET_MS);
  let cursor = 0;
  let last = 0;
  let reported = 0;
  let warm = 0;
  let raf = 0;

  const report = (now: number) => {
    const sorted = [...frames].sort((a, b) => a - b);
    const average = frames.reduce((a, b) => a + b, 0) / frames.length;
    engine.demo?.report();
    setReadout({
      fps: Math.round(1000 / average),
      p95: `${sorted[Math.floor(sorted.length * 0.95)].toFixed(1)} ms`,
      dropped: tally.dropped,
      time: clock((now - tally.t0) / 1000),
      frames: tally.frames,
      average: tally.frames
        ? Math.round(1000 / (tally.sum / tally.frames))
        : 60,
      slowest: `${tally.slow.toFixed(1)} ms`,
      peak: tally.peak,
      updates: tally.updates,
      naive: tally.naive,
      selected: tally.selected,
      scrolled: tally.scroll,
    });
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = last ? now - last : BUDGET_MS;
    last = now;
    if (dt < 250) {
      frames[cursor++ % frames.length] = dt;
      if (++warm > WARM_UP_FRAMES) {
        tally.frames++;
        tally.sum += dt;
        if (dt > 25) tally.dropped++;
        if (dt > tally.slow) tally.slow = dt;
        if (engine.glyphs) tally.updates += count();
      }
    }
    pointer.sx += (pointer.x - pointer.sx) * 0.22;
    pointer.sy += (pointer.y - pointer.sy) * 0.22;
    engine.glyphs?.draw(now);
    engine.demo?.tick(now);
    if (countUp() < 1)
      setCountUp(1 - (1 - clamp((now - tally.t0) / COUNT_UP_MS, 0, 1)) ** 3);
    if (pen) {
      const { width, height } = spark;
      const bar = width / frames.length;
      pen.clearRect(0, 0, width, height);
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[(cursor + i) % frames.length];
        const tall =
          (Math.min(frame, BUDGET_MS * 2) / (BUDGET_MS * 2)) * height;
        pen.fillStyle = frame <= 18.5 ? skin.gold : skin.ember;
        pen.fillRect(i * bar, height - tall, Math.max(1, bar - 1), tall);
      }
    }
    if (now - reported > REPORT_EVERY_MS) {
      reported = now;
      report(now);
    }
  };

  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
