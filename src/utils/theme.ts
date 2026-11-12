import { engine, light, readSkin, remember, setLight, still } from './session';

const REVEAL_MS = 650;

const apply = () => {
  setLight(!light());
  document.documentElement.classList.toggle('light', light());
  remember('theme', light() ? 'light' : 'dark');
  readSkin();
  engine.glyphs?.draw(performance.now());
};

export function toggleTheme(x: number, y: number) {
  if (!document.startViewTransition || still()) {
    apply();
    return;
  }
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  document
    .startViewTransition(apply)
    .ready.then(() =>
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: REVEAL_MS,
          easing: 'cubic-bezier(.4,0,.2,1)',
          pseudoElement: '::view-transition-new(root)',
        },
      ),
    )
    .catch(() => {});
}
