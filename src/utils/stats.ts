import raw from '../data/stats.json';
import type { Stats } from '../types/interfaces';

const DAY_MS = 864e5;

export const stats = raw as unknown as Stats;
export const counts = stats.calendar.counts;

const day0 = Date.parse(stats.calendar.start);
const active = counts.filter(Boolean).sort((a, b) => a - b);
const cuts = [0.25, 0.5, 0.75].map((q) => active[(active.length * q) | 0]);

export const dayAt = (i: number) => new Date(day0 + i * DAY_MS);
export const fetchedOn = new Date(stats.fetchedAt);
export const total = counts.reduce((a, b) => a + b, 0);
export const activeDays = active.length;
export const busiest = active[active.length - 1] ?? 0;
export const weeks = Math.ceil(counts.length / 7);
const publicDays = Object.keys(stats.days).map(Number);

export const level = (count: number) =>
  count ? 1 + cuts.filter((cut) => count > cut).length : 0;

export const percentile = (count: number) =>
  Math.round(
    (active.filter((v) => v < count).length / (active.length || 1)) * 100,
  );

export const runs: ([position: number, length: number] | undefined)[] = [];
for (let i = 0, start = -1; i <= counts.length; i++) {
  if (counts[i]) {
    if (start < 0) start = i;
  } else if (start >= 0) {
    for (let k = start; k < i; k++) runs[k] = [k - start + 1, i - start];
    start = -1;
  }
}

export const streak = runs.reduce(
  (longest, run) => Math.max(longest, run?.[1] ?? 0),
  0,
);

export const nearestPublicDay = (i: number) =>
  publicDays.reduce(
    (a, b) => (Math.abs(b - i) < Math.abs(a - i) ? b : a),
    publicDays[0] ?? i,
  );

export const fullestPublicDay = publicDays.reduce(
  (a, b) => (stats.days[b].length >= (stats.days[a]?.length ?? 0) ? b : a),
  publicDays[0] ?? 0,
);
