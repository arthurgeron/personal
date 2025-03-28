import { A } from '@solidjs/router';
import { createSignal, onCleanup, onMount } from 'solid-js';
import SocialLinks from '../shared/SocialLinks';
import { isDarkMode } from '../../utils/theme';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  gridX?: number;
  gridY?: number;
}

export default function Hero() {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationFrame: number | undefined;
  const [isVisible, setIsVisible] = createSignal(true);
  const connectionDistance = 150;
  const gridSize = connectionDistance;
  const spatialGrid: Record<string, Particle[]> = {};

  onMount(() => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    // Function to get appropriate colors based on theme
    const getThemeColors = () => {
      return isDarkMode() 
        ? { particle: 'rgba(255, 255, 255, $opacity)', connection: 'rgba(255, 255, 255, $opacity)' }
        : { particle: 'rgba(16, 185, 129, $opacity)', connection: 'rgba(16, 185, 129, $opacity)' };
    };

    // Theme change observer
    const themeObserver = new MutationObserver(() => {
      // Force redraw on theme change
      if (canvasRef && ctx) {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      }
    });
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Detect if we should throttle animation based on device
    const isMobile = window.innerWidth < 768;
    const shouldThrottle = isMobile;
    let lastFrameTime = 0;

    // Configure canvas
    const resizeCanvas = () => {
      if (!canvasRef) return;
      // Store current state if context exists
      // const currentParticles = [...particles];

      // Set dimensions based on viewport
      const prevWidth = canvasRef.width;
      const prevHeight = canvasRef.height;
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Setup visibility tracking to properly pause/resume animation
    const handleVisibilityChange = () => {
      const newIsVisible = !document.hidden;
      setIsVisible(newIsVisible);

      // Restart animation if becoming visible again and no animation frame is active
      if (newIsVisible && !animationFrame) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle system setup
    const particles: Particle[] = [];
    const particleCount = isMobile ? 75 : 150; // Reduced count for mobile

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvasRef.width,
        y: Math.random() * canvasRef.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Spatial partitioning functions
    const updateSpatialGrid = () => {
      // Clear grid
      for (const key of Object.keys(spatialGrid)) {
        spatialGrid[key] = [];
      }

      // Assign particles to grid cells
      for (const particle of particles) {
        const gridX = Math.floor(particle.x / gridSize);
        const gridY = Math.floor(particle.y / gridSize);
        particle.gridX = gridX;
        particle.gridY = gridY;

        const key = `${gridX},${gridY}`;
        if (!spatialGrid[key]) {
          spatialGrid[key] = [];
        }
        spatialGrid[key].push(particle);
      }
    };

    const getNeighboringParticles = (particle: Particle): Particle[] => {
      if (particle.gridX === undefined || particle.gridY === undefined)
        return [];

      const neighbors: Particle[] = [];

      // Check 9 surrounding cells (including current cell)
      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          const checkX: number = particle.gridX + offsetX;
          const checkY: number = particle.gridY + offsetY;
          const key = `${checkX},${checkY}`;

          if (spatialGrid[key]) {
            neighbors.push(...spatialGrid[key]);
          }
        }
      }

      return neighbors;
    };

    // Connection lines
    const drawLines = (p1: Particle, p2: Particle) => {
      if (p1 === p2) return; // Skip self

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const colors = getThemeColors();
        const opacity = 0.15 * (1 - distance / connectionDistance);
        const connectionColor = colors.connection.replace('$opacity', opacity.toString());
        
        ctx.beginPath();
        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = (timestamp = 0) => {
      // Save the original global settings
      ctx.save();
      // Reset critical properties that could make content invisible
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      // Don't continue animation if component isn't visible or canvas isn't available
      if (!canvasRef || !ctx || !isVisible()) {
        ctx.restore();
        // Always request next frame even if we skip this one
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      // Check if canvas dimensions are valid
      if (canvasRef.width === 0 || canvasRef.height === 0) {
        resizeCanvas();
        ctx.restore();
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      // Ensure context is preserved between frames

      // Throttle frame rate on mobile devices
      if (shouldThrottle && timestamp - lastFrameTime < 33) {
        ctx.restore();
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      // Fill canvas with theme-appropriate background color
      const themeColors = getThemeColors();
      const bgColor = isDarkMode() ? 'rgba(13, 17, 23, 0.3)' : 'rgba(240, 253, 244, 0.3)';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

      // Update positions
      for (const particle of particles) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around screen edges
        if (particle.x > canvasRef.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvasRef.width;
        if (particle.y > canvasRef.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvasRef.height;
      }

      // Update spatial grid for optimized connections
      updateSpatialGrid();

      // Draw particles and connections
      for (const particle of particles) {
        // Draw particle
        const colors = getThemeColors();
        const particleColor = colors.particle.replace('$opacity', particle.opacity.toString());
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Get neighboring particles and draw connections
        const neighbors = getNeighboringParticles(particle);
        for (const neighbor of neighbors) {
          if (particle !== neighbor) {
            drawLines(particle, neighbor);
          }
        }
      }

      // Schedule next frame only after completing this one
      ctx.restore();
      animationFrame = requestAnimationFrame(animate);
    };

    // Start the animation
    animate();

    // Ensure proper cleanup
    onCleanup(() => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = undefined; // Clear the reference
      }
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      themeObserver.disconnect();
    });
  });

  return (
    <div class="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} class="absolute top-0 left-0 w-full h-full z-0" />
      <div class="container mx-auto px-4 z-10">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-4 text-gradient">
            Arthur Geron
          </h1>
          <h2 class="text-xl md:text-2xl mb-8 text-neutral-content">
            Web3 & React Developer | Fuel Network Contributor
          </h2>
          <p class="max-w-2xl mx-auto text-lg mb-8">
            Building the decentralized future with modern web technologies.
            Specializing in React, React Native, and blockchain solutions.
          </p>
          <div class="mb-8">
            <SocialLinks />
          </div>
          <div class="mt-8">
            <A href="/projects" class="btn btn-primary btn-lg mr-4">
              View Projects
            </A>
            <A href="/contact" class="btn btn-outline btn-lg">
              Contact Me
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}
