import { lazy, Suspense } from 'solid-js';
import { Route } from '@solidjs/router';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Suspense fallback={<div class="flex h-screen w-full items-center justify-center">Loading...</div>}>
        <Route path="/" component={lazy(() => import('./pages/Home'))} />
      </Suspense>
    </Layout>
  );
}

export default App; 