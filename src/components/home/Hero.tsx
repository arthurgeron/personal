import { A } from '@solidjs/router';
import { onCleanup, onMount } from 'solid-js';
import SocialLinks from '../shared/SocialLinks';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function Hero() {
  let canvasRef: HTMLCanvasElement | undefined;
  let animationFrame: number | undefined;

  onMount(() => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    // Configure canvas
    const resizeCanvas = () => {
      if (!canvasRef) return;
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system setup
    const particles: Particle[] = [];
    const particleCount = 100;

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

    // Connection lines
    const drawLines = (p1: Particle, p2: Particle) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - distance / 150)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around screen edges
        if (particle.x > canvasRef.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvasRef.width;
        if (particle.y > canvasRef.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvasRef.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        ctx.fill();

        // Connect particles with lines
        for (let j = index + 1; j < particles.length; j++) {
          drawLines(particle, particles[j]);
        }
      });

      // Make sure animation keeps running continuously
      animationFrame = requestAnimationFrame(animate);
    };

    // Start the animation
    animate();

    // Ensure proper cleanup
    onCleanup(() => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', resizeCanvas);
    });
  });

  return (
    <div class="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        class="absolute top-0 left-0 w-full h-full -z-10"
      />
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
