import { generateHydrationScript, renderToString } from 'solid-js/web';
import App from './App';

export const page = () => renderToString(() => <App />);
export const hydration = generateHydrationScript;
