import type { DayItem, ItemKind, Stats } from '../src/types/interfaces';

const LOGIN = 'arthurgeron';
const PACKAGE = `@${LOGIN}/eslint-plugin-react-usememo`;
const FILE = new URL('../src/data/stats.json', import.meta.url);
const FIRST_YEAR = 2013;
const DAY_MS = 864e5;
const PAGE = 100;
const SEARCH_LIMIT = 1000;
const TITLE_LENGTH = 96;

interface Found {
  kind: ItemKind;
  date: string;
  repo: string;
  ref: number | string;
  title: string;
  state?: string;
}

interface Issue {
  created_at: string;
  repository_url: string;
  number: number;
  title: string;
  state: string;
  pull_request?: { merged_at: string | null };
}

interface Commit {
  sha: string;
  repository: { full_name: string };
  commit: { message: string; author: { date: string } };
}

const previous: Stats = await Bun.file(FILE).json();

const get = async (url: string, init: RequestInit = {}) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return response;
};

const github = (path: string) =>
  get(`https://api.github.com${path}`, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${process.env.GH_TOKEN}`,
    },
  }).then((response) => response.json());

const search = (
  kind: 'issues' | 'commits',
  query: string,
  page = 1,
  size = PAGE,
) =>
  github(
    `/search/${kind}?q=${encodeURIComponent(query)}&per_page=${size}&page=${page}&sort=${kind === 'issues' ? 'created' : 'author-date'}&order=desc`,
  );

const searchAll = async <T>(kind: 'issues' | 'commits', query: string) => {
  const found: T[] = [];
  for (let page = 1; found.length < SEARCH_LIMIT; page++) {
    const { items } = await search(kind, query, page);
    found.push(...items);
    if (items.length < PAGE) break;
  }
  return found;
};

const total = (query: string) =>
  search('issues', query, 1, 1).then((result) => result.total_count as number);

const repoOf = (issue: Issue) =>
  issue.repository_url.replace('https://api.github.com/repos/', '');

const fromIssue =
  (kind: ItemKind) =>
  (issue: Issue): Found => ({
    kind,
    date: issue.created_at.slice(0, 10),
    repo: repoOf(issue),
    ref: issue.number,
    title: issue.title,
    state: issue.pull_request?.merged_at ? 'merged' : issue.state,
  });

// GitHub files a commit under the calendar day of its own timestamp, in the author's time zone
const fromCommit = (found: Commit): Found => ({
  kind: 'c',
  date: found.commit.author.date.slice(0, 10),
  repo: found.repository.full_name,
  ref: found.sha.slice(0, 7),
  title: found.commit.message.split('\n')[0],
});

const number = (text?: string) => Number(text?.replace(/,/g, ''));

const profile = (range = '') =>
  get(`https://github.com/users/${LOGIN}/contributions${range}`).then(
    (response) => response.text(),
  );

// read from the public profile, because the GraphQL calendar returned lower counts than the profile shows for the same days
const calendar = async () => {
  const page = await profile();
  const tips = new Map(
    [...page.matchAll(/<tool-tip[^>]* for="([^"]+)"[^>]*>\s*([\d,]+) /g)].map(
      ([, id, count]) => [id, number(count)],
    ),
  );
  const days = [...page.matchAll(/data-date="([\d-]+)" id="([^"]+)"/g)]
    .map(([, date, id]) => ({ date, count: tips.get(id) ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!days.some((day) => day.count))
    throw new Error('the contribution calendar came back empty');
  return { start: days[0].date, counts: days.map((day) => day.count) };
};

const allTime = async () => {
  let sum = 0;
  for (let year = FIRST_YEAR; year <= new Date().getUTCFullYear(); year++) {
    const page = await profile(`?from=${year}-01-01&to=${year}-12-31`);
    const count = number(page.match(/([\d,]+)\s+contributions?\s+in/)?.[1]);
    if (Number.isNaN(count)) throw new Error(`no total for ${year}`);
    sum += count;
  }
  return sum;
};

// public work only, listed pull requests first, and never more items than the calendar counted that day
const publicWork = async ({ start, counts }: Stats['calendar']) => {
  const since = `author:${LOGIN} is:public`;
  const found = [
    ...(
      await searchAll<Issue>('issues', `${since} is:pr created:>=${start}`)
    ).map(fromIssue('p')),
    ...(
      await searchAll<Issue>('issues', `${since} is:issue created:>=${start}`)
    ).map(fromIssue('i')),
    ...(
      await searchAll<Commit>('commits', `${since} author-date:>=${start}`)
    ).map(fromCommit),
  ];
  const repos: string[] = [];
  const days: Stats['days'] = {};
  for (const item of found) {
    const day = Math.round(
      (Date.parse(item.date) - Date.parse(start)) / DAY_MS,
    );
    const list = days[day] ?? [];
    if (!(day in counts) || list.length >= counts[day]) continue;
    if (!repos.includes(item.repo)) repos.push(item.repo);
    const entry: DayItem = [
      item.kind,
      repos.indexOf(item.repo),
      item.ref,
      item.title.slice(0, TITLE_LENGTH),
    ];
    if (item.state) entry.push(item.state);
    days[day] = [...list, entry];
  }
  return { repos, days };
};

const codebases = async () => {
  const merged = await searchAll<Issue>(
    'issues',
    `author:${LOGIN} is:pr is:merged is:public -user:${LOGIN}`,
  );
  return new Set(merged.map(repoOf)).size;
};

const downloads = (period: string) =>
  get(`https://api.npmjs.org/downloads/point/${period}/${PACKAGE}`)
    .then((response) => response.json())
    .then((result) => result.downloads as number);

const releases = () =>
  get(`https://registry.npmjs.org/${PACKAGE.replace('/', '%2F')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  })
    .then((response) => response.json())
    .then((result) => Object.keys(result.versions).length);

const dependents = async () => {
  const page = await get(
    `https://github.com/${LOGIN}/eslint-plugin-react-usememo/network/dependents`,
  ).then((response) => response.text());
  const count = page.match(/([\d,]+)\s+Repositories/)?.[1];
  if (!count) throw new Error('no dependents count on the page');
  return number(count);
};

// a failed source keeps the value from the last successful run, so the site never loses a figure
const keep = async <T>(name: string, fallback: T, load: () => Promise<T>) => {
  try {
    return await load();
  } catch (error) {
    console.warn(`${name}: kept the previous value. ${error}`);
    return fallback;
  }
};

const days = await keep('calendar', previous.calendar, calendar);
const work = await keep(
  'public work',
  { repos: previous.repos, days: previous.days },
  () => publicWork(days),
);
const mergedPrs = await keep('merged pull requests', 0, () =>
  total(`author:${LOGIN} is:pr is:merged`),
);

const stats: Stats = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  calendar: days,
  ...work,
  allTime: await keep('all-time contributions', previous.allTime, allTime),
  // only a personal token can count private repositories, so a smaller public-only total never replaces it
  mergedPrs: Math.max(previous.mergedPrs, mergedPrs),
  codebases: await keep('codebases', previous.codebases, codebases),
  fuelPrs: await keep('Fuel pull requests', previous.fuelPrs, () =>
    total(`org:FuelLabs author:${LOGIN} is:pr is:merged`),
  ),
  blueprintPrs: await keep(
    'Blueprint pull requests',
    previous.blueprintPrs,
    () =>
      total(`org:Blueprint-Finance author:${LOGIN} is:pr is:merged is:public`),
  ),
  plugin: {
    weekly: await keep('weekly downloads', previous.plugin.weekly, () =>
      downloads('last-week'),
    ),
    yearly: await keep('yearly downloads', previous.plugin.yearly, () =>
      downloads('last-year'),
    ),
    dependents: await keep(
      'dependents',
      previous.plugin.dependents,
      dependents,
    ),
    releases: await keep('releases', previous.plugin.releases, releases),
  },
};

await Bun.write(
  FILE,
  `{\n${Object.entries(stats)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)}`)
    .join(',\n')}\n}\n`,
);
