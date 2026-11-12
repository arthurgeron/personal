import { For, Show } from 'solid-js';
import { FIXED_NOTE, LINT, PROBLEMS } from '../constants/lint';
import { lintFixed, setLintFixed } from '../utils/session';

const toggle = () => setLintFixed(!lintFixed());
const lines = () => (lintFixed() ? LINT.after : LINT.before);

const LintDemo = () => (
  <>
    <div class="lint" id="lint" classList={{ ok: lintFixed() }}>
      <div class="lbar">
        <span>Toolbar.jsx</span>
        <b>
          <Show when={lintFixed()} fallback="2 problems">
            0 problems
          </Show>
        </b>
      </div>
      <div class="code" tabindex="0" role="group" aria-label="Code sample">
        <For each={lines()}>
          {(line) => (
            <div
              classList={{ new: line.startsWith('+') }}
              innerHTML={line.replace(/^\+/, '')}
            />
          )}
        </For>
      </div>
      <ul class="lprob" aria-live="polite">
        <Show
          when={lintFixed()}
          fallback={
            <For each={PROBLEMS}>
              {(problem) => (
                <li>
                  <b>error</b>
                  {problem.message}
                  <span>{problem.rule}</span>
                </li>
              )}
            </For>
          }
        >
          <li>
            <b>fixed</b>
            {FIXED_NOTE}
          </li>
        </Show>
      </ul>
    </div>
    <div class="lfoot">
      <button class="btn" type="button" onClick={toggle}>
        <Show when={lintFixed()} fallback="eslint --fix">
          Undo
        </Show>
      </button>
      <p>
        A replay of the rule's documented autofix. The real one runs in your
        editor and in CI.
      </p>
    </div>
  </>
);

export default LintDemo;
