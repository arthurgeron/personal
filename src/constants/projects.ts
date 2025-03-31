import type { Project } from '../types/interfaces';

// Project categories for filtering
export const CATEGORIES = ['All', 'Frontend', 'Web3', 'Tools', 'Libraries'];

// Projects for the main Projects page
export const PROJECTS: Project[] = [
  {
    id: 'eslint-plugin',
    title: 'ESLint Plugin for React useMemo',
    description:
      'A plugin that helps developers write more efficient React components by properly using useMemo for performance optimization.',
    technologies: ['TypeScript', 'ESLint', 'React'],
    category: 'Tools',
    github: 'https://github.com/arthurgeron/eslint-plugin-react-usememo',
    stars: 73,
    featured: true,
  },
  {
    id: 'context-selector',
    title: 'Context Selector',
    description:
      'A library that enables efficient React Context API usage with native selector patterns.',
    technologies: ['TypeScript', 'React'],
    category: 'Libraries',
    github: 'https://github.com/arthurgeron/context-selector',
    stars: 10,
    featured: true,
  },
  {
    id: 'web-crawler',
    title: 'Web Crawler',
    description:
      'A customizable web crawler built in Python for gathering and analyzing web data.',
    technologies: ['Python', 'Web Scraping'],
    category: 'Tools',
    github: 'https://github.com/arthurgeron/webCrawler',
    featured: true,
  },
  {
    id: 'miner-away',
    title: 'MinerAway',
    description: 'A tool to detect and block JavaScript miners on websites.',
    technologies: ['JavaScript', 'Browser Extension'],
    category: 'Tools',
    github: 'https://github.com/arthurgeron/MinerAway',
    featured: false,
  },
  {
    id: 'eslint-config',
    title: 'ESLint Config',
    description:
      'Custom ESLint configuration for React JS and React Native projects.',
    technologies: ['JavaScript', 'ESLint'],
    category: 'Tools',
    github: 'https://github.com/arthurgeron/eslint-config',
    featured: false,
  },
];

// Featured projects for the home page
export const FEATURED_PROJECTS: Project[] = PROJECTS.filter(project => project.featured); 