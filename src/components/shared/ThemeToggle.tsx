import { createSignal, onMount } from 'solid-js';

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal(
    'light'// localStorage.getItem('theme'),
  );

  onMount(() => {
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setTheme(savedTheme);
    } else {
      // Check system preference
      // const prefersDark = window.matchMedia(
      //   '(prefers-color-scheme: dark)',
      // ).matches;
      // const defaultTheme = prefersDark ? 'dark' : 'light';
      const defaultTheme = 'light';
      document.documentElement.setAttribute('data-theme', defaultTheme);
      setTheme(defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    }
  });

  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="p-2 rounded-full hover:bg-base-200 transition-colors duration-200"
      aria-label={`Switch to ${theme() === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme() === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <title>Dark Mode</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <title>Light Mode</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )}
    </button>
  );
}
