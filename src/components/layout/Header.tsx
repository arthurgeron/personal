import { A } from '@solidjs/router';
import { createSignal, onCleanup, onMount } from 'solid-js';
import ThemeToggle from '../shared/ThemeToggle';
import { isDarkMode } from '../../utils/theme';

export default function Header() {
  const [scrolled, setScrolled] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  const toggleMenu = () => setMenuOpen(!menuOpen());

  return (
    <header
      class="fixed top-0 w-full z-50 transition-all duration-300"
      classList={{
        'bg-base-100/90 backdrop-blur-md shadow-md': scrolled() && !isDarkMode(),
        'bg-gray-900/90 backdrop-blur-md shadow-md': scrolled() && isDarkMode(),
        'bg-transparent': !scrolled(),
      }}
    >
      <div class="container-custom py-4 flex justify-between items-center">
        <A href="/" class="text-2xl font-bold text-gradient">
          AG
        </A>

        {/* Desktop Navigation */}
        <nav class="hidden md:flex items-center space-x-8">
          <A href="/" class="animated-border font-medium">
            Home
          </A>
          <A href="/about" class="animated-border font-medium">
            About
          </A>
          <A href="/projects" class="animated-border font-medium">
            Projects
          </A>
          <A href="/contact" class="animated-border font-medium">
            Contact
          </A>
          {/* <ThemeToggle /> */}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          class="md:hidden text-neutral"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d={
                menuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        class="md:hidden absolute w-full transition-all duration-300 overflow-hidden shadow-md"
        classList={{
          'bg-base-100/95 backdrop-blur-md': !isDarkMode(),
          'bg-gray-900/95 backdrop-blur-md': isDarkMode(),
        }}
        style={{
          'max-height': menuOpen() ? '300px' : '0px',
          opacity: menuOpen() ? 1 : 0,
        }}
      >
        <nav class="flex flex-col p-4 space-y-4">
          <A 
            href="/" 
            class="py-2 px-4" 
            classList={{
              'text-gray-300': isDarkMode(),
            }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </A>
          <A 
            href="/about" 
            class="py-2 px-4" 
            classList={{
              'text-gray-300': isDarkMode(),
            }}
            onClick={() => setMenuOpen(false)}
          >
            About
          </A>
          <A
            href="/projects"
            class="py-2 px-4"
            classList={{
              'text-gray-300': isDarkMode(),
            }}
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </A>
          <A
            href="/contact"
            class="py-2 px-4"
            classList={{
              'text-gray-300': isDarkMode(),
            }}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </A>
          <div class="py-2 px-4">
            {/* <ThemeToggle /> */}
          </div>
        </nav>
      </div>
    </header>
  );
}
