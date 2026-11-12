import type { DayItem } from '../types/interfaces';
import { fmt } from './format';
import { busiest, counts, percentile, runs, stats } from './stats';

const KIND = { p: 'pull request', i: 'issue', c: 'commit' };
const PATH = { p: 'pull', i: 'issues', c: 'commit' };
const LONG_STREAK = 6;

export const kindOf = ([kind, , , , state]: DayItem) =>
  state === 'merged' ? 'merged PR' : KIND[kind];

export const hrefOf = ([kind, repo, ref]: DayItem) =>
  `https://github.com/${stats.repos[repo]}/${PATH[kind]}/${ref}`;

export const sourceOf = ([kind, repo, ref]: DayItem) =>
  kind === 'c' ? stats.repos[repo] : `${stats.repos[repo]} #${ref}`;

export const noteFor = (day: number) => {
  const count = counts[day];
  const run = runs[day];
  const rank = percentile(count);
  const streakNote =
    run && run[1] > LONG_STREAK
      ? ` Day ${run[0]} of a ${run[1]}-day streak.`
      : '';
  if (!count) return 'A day off.';
  if (count === busiest) return `The busiest day of the year.${streakNote}`;
  if (rank < 25) return `A quiet one.${streakNote}`;
  return `Busier than ${rank}% of my active days.${streakNote}`;
};

export const privateNote = (count: number) => {
  if (!count) return 'Nothing recorded on GitHub.';
  const where =
    count > 1
      ? `All ${fmt(count)} were in private repositories`
      : 'It was in a private repository';
  return `${where}, so there is nothing here I can link.`;
};
