export type ItemKind = 'p' | 'i' | 'c';

export type DayItem = [
  kind: ItemKind,
  repo: number,
  ref: number | string,
  title: string,
  state?: string,
];

export interface Stats {
  fetchedAt: string;
  calendar: { start: string; counts: number[] };
  repos: string[];
  days: Record<string, DayItem[]>;
  allTime: number;
  mergedPrs: number;
  codebases: number;
  fuelPrs: number;
  blueprintPrs: number;
  plugin: {
    weekly: number;
    yearly: number;
    dependents: number;
    releases: number;
  };
}

export interface Link {
  label: string;
  href: string;
}

export interface Result {
  figure: string;
  text: string;
}

export interface Role {
  title: string;
  company: string;
  from: string;
  to: string;
}

export interface CareerRow {
  era: number;
  year: string;
  card: string;
  when: string;
  org: string;
  role: string;
  headline: string;
  body: string;
  link?: Link;
  tail?: string;
  results?: Result[];
  evidence?: Link;
  cv?: Role;
}

export interface Era {
  year: string;
  button: string;
  quote: string;
}

export interface Company {
  name: string;
  note: string;
  tag?: string;
}

export interface Upstream {
  name: string;
  repo: string;
  what: string;
  query?: string;
}

export interface Command {
  name: string;
  hint: string | (() => string);
  run: () => void;
}

export interface Block {
  height: number;
  hash: string;
  tx: string;
  orphan?: boolean;
}

export interface Glyphs {
  build: () => void;
  place: () => void;
  fit: () => void;
  draw: (now: number) => void;
  anchor: (id: string) => [x: number, y: number] | undefined;
  readonly def: number;
}

export interface Demo {
  fit: () => void;
  size: (cols: number, rows: number) => void;
  tick: (now: number) => void;
  report: () => void;
}
