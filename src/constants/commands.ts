import type { Command } from '../types/interfaces';
import {
  downloadCv,
  go,
  toggleContrast,
  toggleStill,
  toggleXray,
} from '../utils/actions';
import { fmt } from '../utils/format';
import {
  count,
  engine,
  maxGlyphs,
  setCount,
  setLintFixed,
  wave,
} from '../utils/session';
import { toggleTheme } from '../utils/theme';

export const COMMANDS: Command[] = [
  { name: 'Go to top', hint: 'hero', run: go('top') },
  { name: 'Go to 13 years', hint: 'career timeline', run: go('years') },
  { name: 'Go to 60 fps', hint: 'React render demo', run: go('sixty') },
  {
    name: 'Go to Open source',
    hint: 'contributions, upstream fixes and the ESLint plugin',
    run: go('oss'),
  },
  { name: 'Go to Web3', hint: 'transaction states', run: go('web3') },
  { name: 'Go to Hire me', hint: 'consulting', run: go('hire') },
  { name: 'Say hi', hint: 'contact and receipt', run: go('contact') },
  { name: 'Download CV', hint: 'PDF, built in your browser', run: downloadCv },
  {
    name: 'Toggle theme',
    hint: 'ink on paper, or gold on black',
    run: () => toggleTheme(innerWidth / 2, innerHeight / 2),
  },
  {
    name: 'Toggle X-ray',
    hint: 'see how the page is built',
    run: toggleXray,
  },
  {
    name: 'Pause or resume motion',
    hint: 'rain, marquees and transitions',
    run: toggleStill,
  },
  {
    name: 'Toggle more contrast',
    hint: 'undim the inactive timeline rows',
    run: toggleContrast,
  },
  {
    name: 'Run eslint --fix',
    hint: 'replay the plugin autofix',
    run: () => {
      go('lint')();
      setLintFixed(true);
    },
  },
  {
    name: 'Max out the rain',
    hint: () => `${fmt(maxGlyphs())} glyphs`,
    run: () => setCount(maxGlyphs()),
  },
  {
    name: 'Reset the rain',
    hint: 'back to default',
    run: () => setCount(engine.glyphs?.def ?? count()),
  },
  {
    name: 'Shockwave',
    hint: 'push everything',
    run: () => wave(innerWidth / 2, scrollY + innerHeight / 2, 3),
  },
];
