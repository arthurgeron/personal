// Global type definitions

// Hero Component Types
export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  gridX?: number;
  gridY?: number;
}

// Project Component Types
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category?: string;
  github: string;
  stars?: number;
  featured?: boolean;
}

// Skills Component Types
export interface Skill {
  name: string;
  category: string;
}

// Theme Types
export interface ThemeColors {
  particle: string;
  connection: string;
} 