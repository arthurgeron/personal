import { lazy, Suspense } from 'solid-js';
import { Route } from '@solidjs/router';
import { ParentProps } from 'solid-js';
import Layout from './components/layout/Layout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Root component that will be used as the layout for all routes
const Root = (props: ParentProps) => {
  return (
    <Layout>
      <Suspense fallback={<div class="flex h-screen w-full items-center justify-center">Loading...</div>}>
        {props.children}
      </Suspense>
    </Layout>
  );
};

function App() {
  return (
    <Route path="/" component={Root}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
      <Route path="*" component={NotFound} />
    </Route>
  );
}

export default App; 