import {
  contrast,
  remember,
  scrollBehavior,
  setContrast,
  setStill,
  setXray,
  still,
  xray,
} from './session';

export const go = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });

export const toggleXray = () => setXray(!xray());
export const toggleStill = () => setStill(!still());
export const toggleContrast = () => {
  setContrast(!contrast());
  remember('contrast', contrast() ? 'more' : 'less');
};

// jsPDF only downloads when a visitor asks for the CV
export const downloadCv = () =>
  import('./cv').then(({ saveCv }) => saveCv()).catch(console.error);
