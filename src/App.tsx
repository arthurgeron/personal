import { lazy, Suspense } from 'solid-js';
import { Route } from '@solidjs/router';

function App() {
  return (
    <div class="min-h-screen bg-base-100">
      <Suspense fallback={<div class="flex h-screen w-full items-center justify-center">Loading...</div>}>
        <Route path="/" component={lazy(() => import('./pages/Home'))} />
      </Suspense>
    </div>
  );
}

export default App; 