// Declaration file for CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declaration file for asset modules
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Additional type definitions
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  stars?: number;
  featured?: boolean;
}

interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'web3' | 'tools' | 'languages';
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  achievements?: string[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
} 