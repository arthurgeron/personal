import { createSignal, onCleanup, onMount } from 'solid-js';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Skills from '../components/home/Skills';
import Projects from '../components/home/Projects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  
  onMount(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <div 
      class="min-h-screen" 
      classList={{ 'opacity-0': !isLoaded(), 'opacity-100 transition-opacity duration-1000': isLoaded() }}
    >
      <Hero />
      <About />
      <Skills />
      <Projects />
    </div>
  );
};

export default Home; 