import { createSignal, createEffect } from 'solid-js';

// Create a globally accessible theme signal that can be imported by any component
export const [isDarkMode, setIsDarkMode] = createSignal(false);

// Initialize theme detection
export function initThemeDetection() {
  // Initial detection
  setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
  
  // Set up observer for theme changes
  const observer = new MutationObserver(() => {
    setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  
  return () => observer.disconnect();
}

// Hook for components to use dark mode detection
export function createThemeDetection() {
  createEffect(initThemeDetection);
  return isDarkMode;
}

// Get theme-specific colors for various UI elements
export function getThemeColors() {
  return {
    particle: isDarkMode() 
      ? 'rgba(255, 255, 255, $opacity)'
      : 'rgba(16, 185, 129, $opacity)',
    connection: isDarkMode()
      ? 'rgba(255, 255, 255, $opacity)'
      : 'rgba(16, 185, 129, $opacity)',
    background: isDarkMode()
      ? 'bg-gray-900'
      : 'bg-base-100',
    text: isDarkMode()
      ? 'text-gray-300'
      : 'text-neutral',
    headerBg: isDarkMode()
      ? 'bg-gray-900/90'
      : 'bg-base-100/90',
    cardBg: isDarkMode()
      ? 'bg-gray-800'
      : 'bg-base-100',
  };
} 