import { createSignal, onCleanup, onMount } from 'solid-js';

const Home = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  
  onMount(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <div class="min-h-screen flex flex-col">
      <div 
        class="hero min-h-screen" 
        classList={{ 'opacity-0': !isVisible(), 'opacity-100 transition-opacity duration-1000': isVisible() }}
      >
        <div class="hero-content text-center">
          <div class="max-w-3xl">
            <h1 class="text-5xl font-bold text-gradient mb-6">Arthur Geron</h1>
            <h2 class="text-2xl mb-8">Web3 & React Developer | Fuel Network Contributor</h2>
            <p class="text-lg mb-8">
              Building the decentralized future with modern web technologies.
            </p>
            <div class="flex justify-center gap-4">
              <button class="btn btn-primary">View Projects</button>
              <button class="btn btn-outline">Contact Me</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 