import { createSignal, onMount } from 'solid-js';
import { A } from '@solidjs/router';

export default function NotFound() {
  const [visible, setVisible] = createSignal(false);
  
  onMount(() => {
    setTimeout(() => setVisible(true), 100);
  });
  
  return (
    <div 
      class="min-h-screen flex items-center justify-center text-center"
      classList={{
        'opacity-0': !visible(),
        'opacity-100 transition-all duration-700': visible(),
      }}
    >
      <div class="container px-4">
        <h1 class="text-8xl font-bold text-gradient mb-6">404</h1>
        <h2 class="text-3xl font-bold mb-6">Page Not Found</h2>
        <p class="text-lg mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <A 
          href="/" 
          class="btn btn-primary"
          classList={{
            'translate-y-4 opacity-0': !visible(),
            'translate-y-0 opacity-100 transition-all duration-700 delay-300': visible(),
          }}
        >
          Back to Home
        </A>
      </div>
    </div>
  );
} 