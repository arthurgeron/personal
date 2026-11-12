import { fmt, fullDate } from '../utils/format';
import {
  activeDays,
  counts,
  dayAt,
  stats,
  streak,
  total,
  weeks,
} from '../utils/stats';

export const KEYS: Record<string, number> = {
  ArrowLeft: -7,
  ArrowRight: 7,
  ArrowUp: -1,
  ArrowDown: 1,
};
export const LAST = counts.length - 1;
export const MONTH_STARTS = Array.from(
  { length: weeks - 2 },
  (_, week) => week,
).filter(
  (week) =>
    !week ||
    dayAt(week * 7).getUTCMonth() !== dayAt(week * 7 - 7).getUTCMonth(),
);
export const SUMMARY = `Contribution calendar from ${fullDate(dayAt(0))} to ${fullDate(dayAt(LAST))}: ${fmt(total)} contributions on ${activeDays} of ${counts.length} days. Select a day to see what it held.`;
export const KPIS = [
  {
    label: `days with a contribution, out of ${counts.length}`,
    value: activeDays,
  },
  { label: 'days in the longest unbroken streak', value: streak },
  { label: 'contributions since 2013', value: stats.allTime },
  {
    label: 'merged pull requests, private work included',
    value: stats.mergedPrs,
  },
];
