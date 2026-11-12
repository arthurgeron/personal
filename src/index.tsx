import { hydrate, render } from 'solid-js/web';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

if (root.hasChildNodes()) hydrate(() => <App />, root);
else render(() => <App />, root);
