import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { xray } from '../utils/session';

const Xray = () => {
  const [label, setLabel] = createSignal<string>();
  let tip: HTMLDivElement | undefined;

  onMount(() => {
    const onMove = (event: PointerEvent) => {
      if (!xray()) return;
      const target = event.target as Element | null;
      if (!target?.closest?.('main')) {
        setLabel();
        return;
      }
      const box = target.getBoundingClientRect();
      const id = target.id && `#${target.id}`;
      const cls = target.classList[0] ? `.${target.classList[0]}` : '';
      setLabel(
        `<${target.tagName.toLowerCase()}${id}${cls}> ${Math.round(box.width)} x ${Math.round(box.height)}`,
      );
      if (!tip) return;
      tip.style.left = `${Math.min(event.clientX + 14, innerWidth - tip.offsetWidth - 8)}px`;
      tip.style.top = `${event.clientY + 16}px`;
    };
    addEventListener('pointermove', onMove, { passive: true });
    onCleanup(() => removeEventListener('pointermove', onMove));
  });

  return (
    <Show when={xray() && label()}>
      <div id="xr" ref={tip} aria-hidden="true">
        {label()}
      </div>
    </Show>
  );
};

export default Xray;
