const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

export const clamp = (x: number, min: number, max: number) =>
  Math.min(max, Math.max(min, x));

export const smoothstep = (from: number, to: number, x: number) => {
  const t = clamp((x - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
};

export const plural = (n: number, word: string) =>
  `${fmt(n)} ${word}${n === 1 ? '' : 's'}`;

// Intl output differs between the prerender runtime and browsers, which would break hydration
const dayMonth = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;

export const fullDate = (d: Date) => `${dayMonth(d)} ${d.getUTCFullYear()}`;

export const longDate = (d: Date) =>
  `${WEEKDAYS[d.getUTCDay()]}, ${fullDate(d)}`;

export const shortMonth = (d: Date) => MONTHS[d.getUTCMonth()].slice(0, 3);

export const shortDate = (d: Date) => `${d.getUTCDate()} ${shortMonth(d)}`;
