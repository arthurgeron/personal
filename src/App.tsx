import { createEffect } from 'solid-js';
import Contact from './components/Contact';
import Hero from './components/Hero';
import Hire from './components/Hire';
import Hud from './components/Hud';
import OpenSource from './components/OpenSource';
import Palette from './components/Palette';
import Shipped from './components/Shipped';
import Sixty from './components/Sixty';
import Web3 from './components/Web3';
import Xray from './components/Xray';
import Years from './components/Years';
import { useEngine } from './utils/engine';
import { contrast, still, xray } from './utils/session';

const App = () => {
  useEngine();
  for (const [name, on] of Object.entries({ still, xray, contrast }))
    createEffect(() => document.documentElement.classList.toggle(name, on()));

  return (
    <>
      <a class="skip" href="#main">
        Skip to content
      </a>
      <canvas id="gl" aria-hidden="true" />
      <Hud />
      <main id="main" tabindex="-1">
        <Hero />
        <Shipped />
        <Years />
        <Sixty />
        <OpenSource />
        <Web3 />
        <Hire />
        <Contact />
      </main>
      <Palette />
      <Xray />
    </>
  );
};

export default App;
