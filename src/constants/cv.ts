import { fmt } from '../utils/format';
import { stats } from '../utils/stats';
import { GITHUB, LINKEDIN, PLUGIN, SELECTOR_REPO, SITE } from './site';

export const CV_FILE = 'arthur-geron-cv.pdf';
export const CV_NAME = 'Arthur Geron';
export const CV_TITLE = 'Frontend Lead | React, React Native, Web3';
export const CV_LINKS = [SITE, LINKEDIN, GITHUB];
export const CV_KEYWORDS =
  'Frontend, React, React Native, Next.js, TypeScript, JavaScript, Web3, performance, technical leadership';

export const CV_SUMMARY = `Frontend engineer with 13 years of experience building React, React Native and Web3 products. Frontend Lead at Blueprint Finance, previously Senior Frontend Developer at Fuel Labs and Mobile Lead at TradersClub. Author of an ESLint plugin downloaded ${fmt(stats.plugin.yearly)} times from npm in the last 12 months, with code merged into ${stats.codebases} public codebases including AWS, Software Mansion and Stream. Available for consulting on frontend performance, frontend architecture and Web3 delivery.`;

export const CV_SKILLS = [
  'Frontend: React, React Native, Next.js, TypeScript, JavaScript, Redux, AngularJS, styled-components, Webpack',
  'Web3: dApps, wallets and wallet connectors, smart contract integration, Fuel, Sway, Ethereum layer 2, DeFi',
  'Quality: Jest, Testing Library, Cypress, Selenium, Protractor, Karma, ESLint, custom lint rules on the AST, performance profiling',
  'Infrastructure: CI/CD, Node.js, Google Cloud, AWS (CloudFront, API Gateway, Route 53, Lambda, S3)',
  'Leadership: technical leadership, code review, App Store and Play Store releases, technical interviews',
];

export const CV_OPEN_SOURCE = [
  `${PLUGIN}: author and maintainer. ${fmt(stats.plugin.yearly)} npm downloads in the last 12 months, ${fmt(stats.plugin.dependents)} public repositories depending on it, ${fmt(stats.plugin.releases)} releases.`,
  `context-selector (${SELECTOR_REPO.replace('https://', '')}): author. React Context that re-renders only the components reading the changed slice, presented at React Conf Brasil 2021.`,
];

export const CV_EDUCATION = [
  {
    title: "Bachelor's Degree, Analysis and Development of Systems",
    detail:
      'Instituto Federal de Educação, Ciência e Tecnologia de São Paulo | 01/2013 - 12/2017',
  },
  {
    title: 'Computer Science and Information Technology',
    detail: 'Trinity College Dublin | 01/2015 - 12/2016',
  },
];

export const CV_LANGUAGES = ['English (native)', 'Portuguese (native)'];
export const CV_CERTIFICATIONS = ['Certified ScrumMaster, Scrum Alliance'];
export const CV_PUBLICATIONS = [
  'New Perspectives for the Blind with Upcoming Tablet and Smartphone Based Solutions. Sinergia, 10/2016.',
];
