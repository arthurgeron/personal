import { createRequire } from 'node:module';

const FILE = 'dist/index.html';
const ROOT = '<div id="root"></div>';
const HEAD_END = '</head>';

const { page, hydration } = createRequire(import.meta.url)(
  '../.ssr/server.cjs',
);
const shell = await Bun.file(FILE).text();
if (!shell.includes(ROOT) || !shell.includes(HEAD_END))
  throw new Error(`${FILE} has no empty root element or no head to fill`);

await Bun.write(
  FILE,
  shell
    .replace(HEAD_END, () => `${hydration()}${HEAD_END}`)
    .replace(ROOT, () => `<div id="root">${page()}</div>`),
);
