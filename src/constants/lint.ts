import { PLUGIN } from './site';

const RULE = `${PLUGIN.replace('eslint-plugin-', '')}/require-usememo`;
const OBJECT =
  'Object literal should be wrapped in useMemo() or be static when used as a prop';
const CALLBACK =
  'Function definition should be wrapped in useCallback() or be static when used as a prop';

const keyword = (word: string) => `<i class="k">${word}</i>`;
const quoted = (word: string) => `<i class="s">'${word}'</i>`;
const TAG = '&lt;<i class="t">Menu</i>';

export const PROBLEMS = [OBJECT, CALLBACK].map((message) => ({
  message,
  rule: RULE,
}));

export const FIXED_NOTE = '2 problems, and the react import was added.';

// a leading + marks a line the autofix added
export const LINT = {
  before: [
    `${keyword('const')} Toolbar = () =&gt; {`,
    `  ${keyword('const')} theme = <u title="${OBJECT}">{ accent: ${quoted('gold')} }</u>;`,
    `  ${keyword('return')} ${TAG} theme={theme} onOpen={<u title="${CALLBACK}">() =&gt; track(${quoted('open')})</u>} /&gt;;`,
    '}',
  ],
  after: [
    `+${keyword('import')} { useCallback, useMemo } ${keyword('from')} ${quoted('react')};`,
    '+ ',
    `${keyword('const')} Toolbar = () =&gt; {`,
    `  ${keyword('const')} theme = <ins>useMemo(() =&gt; (</ins>{ accent: ${quoted('gold')} }<ins>), [])</ins>;`,
    `+  ${keyword('const')} onOpen = useCallback(() =&gt; track(${quoted('open')}), []);`,
    `  ${keyword('return')} ${TAG} theme={theme} onOpen={<ins>onOpen</ins>} /&gt;;`,
    '}',
  ],
};
