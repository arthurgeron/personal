import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { COMMANDS } from '../constants/commands';
import type { Command } from '../types/interfaces';
import { paletteOpen, setPaletteOpen } from '../utils/session';

const hintOf = ({ hint }: Command) =>
  typeof hint === 'string' ? hint : hint();

const Palette = () => {
  const [query, setQuery] = createSignal('');
  const [selected, setSelected] = createSignal(0);
  let dialog!: HTMLDialogElement;

  const shown = createMemo(() => {
    const needle = query().trim().toLowerCase();
    return COMMANDS.filter((command) =>
      `${command.name} ${hintOf(command)}`.toLowerCase().includes(needle),
    );
  });
  const close = () => setPaletteOpen(false);
  const run = (command: Command) => {
    close();
    command.run();
  };
  const move = (by: number) =>
    setSelected((selected() + by + shown().length) % (shown().length || 1));
  const onInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    setQuery(event.currentTarget.value);
    setSelected(0);
  };
  const onKey = (event: KeyboardEvent) => {
    const command = shown()[selected()];
    if (event.key === 'ArrowDown') move(1);
    else if (event.key === 'ArrowUp') move(-1);
    else if (event.key === 'Enter' && command) run(command);
    else return;
    event.preventDefault();
  };
  const onBackdrop = (event: MouseEvent) => {
    if (event.target === dialog) close();
  };

  createEffect(() => {
    if (!paletteOpen()) {
      dialog.close();
      return;
    }
    setQuery('');
    setSelected(0);
    dialog.showModal();
  });

  onMount(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k')
        return;
      event.preventDefault();
      setPaletteOpen(!paletteOpen());
    };
    addEventListener('keydown', onShortcut);
    onCleanup(() => removeEventListener('keydown', onShortcut));
  });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes a modal dialog natively, the click only covers the backdrop
    <dialog
      id="pal"
      ref={dialog}
      aria-label="Command palette"
      onClose={close}
      onClick={onBackdrop}
    >
      <div class="box">
        <input
          id="pq"
          role="combobox"
          aria-expanded="true"
          aria-controls="pl"
          aria-activedescendant={
            shown().length ? `cmd-${selected()}` : undefined
          }
          aria-label="Filter commands"
          placeholder="Type a command"
          spellcheck={false}
          autocomplete="off"
          value={query()}
          onInput={onInput}
          onKeyDown={onKey}
        />
        <div id="pl" role="listbox" tabIndex={-1} aria-label="Commands">
          <For
            each={shown()}
            fallback={
              <div role="presentation">
                <span>No matching command</span>
              </div>
            }
          >
            {(command, i) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled on the combobox input, which keeps focus
              <div
                id={`cmd-${i()}`}
                role="option"
                tabIndex={-1}
                aria-selected={selected() === i()}
                onClick={[run, command]}
              >
                <b>{command.name}</b>
                <span>{hintOf(command)}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </dialog>
  );
};

export default Palette;
