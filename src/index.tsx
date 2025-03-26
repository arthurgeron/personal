import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import './index.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found. Did you forget to add it to your index.html?');
}

render(() => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>
), root); 