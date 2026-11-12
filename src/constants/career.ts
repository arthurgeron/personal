import type { CareerRow, Era } from '../types/interfaces';
import { fmt } from '../utils/format';
import { stats } from '../utils/stats';
import { HANDLE, PLUGIN, SELECTOR_REPO, TALK, orgSearch } from './site';

export const ERAS: Era[] = [
  {
    year: '2013',
    button: 'Hire Me »',
    quote:
      'Everything looked like leather and brushed metal. We called it rich.',
  },
  {
    year: '2014',
    button: 'Hire me',
    quote:
      'We flattened it all, missed the shadows, added them back and named it Material.',
  },
  {
    year: '2016',
    button: 'Hire me',
    quote: 'Gradients came back. Nobody admitted they had left.',
  },
  {
    year: '2018',
    button: 'Hire me',
    quote: 'Dark mode shipped. Design systems got their own headcount.',
  },
  {
    year: '2020',
    button: 'Hire me',
    quote: 'Neumorphism. Gorgeous, and nobody could find the button.',
  },
  {
    year: '2021',
    button: 'Hire me',
    quote: 'Frosted glass on everything. Our GPUs paid for the blur.',
  },
  {
    year: '2022',
    button: 'Connect Wallet',
    quote: 'Every button became a button that connects a wallet.',
  },
  {
    year: '2024',
    button: '✦ Ask AI',
    quote:
      'A sparkle icon appeared on every product, including the ones with no AI.',
  },
  {
    year: '2026',
    button: 'Say hi',
    quote:
      'Now. Quiet type, one accent colour, and the motion moved into the background.',
  },
];

export const CAREER: CareerRow[] = [
  {
    era: 8,
    year: '2025',
    card: 'Frontend Lead, Blueprint Finance',
    when: '2025 to now',
    org: 'Blueprint Finance',
    role: 'Frontend Lead',
    headline: 'Leading the frontend of Concrete and Glow, two DeFi products.',
    body: 'Product frontends, public documentation and wallet end-to-end testing, with fixes sent upstream to the dappwright test library.',
    evidence: {
      label: `${fmt(stats.blueprintPrs)} public merged PRs`,
      href: orgSearch('Blueprint-Finance'),
    },
    cv: {
      title: 'Frontend Lead',
      company: 'Blueprint Finance',
      from: '04/2025',
      to: 'Present',
    },
  },
  {
    era: 7,
    year: '2024',
    card: 'Senior Frontend Developer, Fuel Labs',
    when: '2024 to 2025',
    org: 'Fuel Labs',
    role: 'Senior Frontend Developer',
    headline: `${fmt(stats.fuelPrs)} pull requests merged into the public products of an Ethereum layer 2.`,
    body: 'The Fuel Wallet browser extension, the wallet connectors other dApps integrate, the block explorer and the bridge.',
    evidence: {
      label: `${fmt(stats.fuelPrs)} merged PRs`,
      href: orgSearch('FuelLabs'),
    },
    cv: {
      title: 'Senior Frontend Developer',
      company: 'Fuel Labs',
      from: '04/2024',
      to: '03/2025',
    },
  },
  {
    era: 6,
    year: '2022',
    card: 'Mobile Lead, TradersClub',
    when: '2022 to 2024',
    org: 'TradersClub',
    role: 'Mobile Lead',
    headline:
      'Promoted a second time, 19 months after joining, to lead the tech leads of every mobile squad.',
    body: 'Reviewed all new mobile code and shipped the App Store and Play Store releases. When a dependency broke, the fix went upstream, in ten merged pull requests: the Amazon IVS player, Stream Chat, react-native-iap and Reanimated.',
    results: [
      {
        figure: '698 ms to 219 ms',
        text: "first render of the web home page, and 43% less render time over the whole load. I replaced regex prop matching with a hash lookup in the company's styled-system fork and moved it to styled-components 6, in July 2023.",
      },
      {
        figure: '40 s to 1–2 s',
        text: 'Android cold start, on the same older phone.',
      },
    ],
    evidence: {
      label: 'upstream PRs',
      href: `https://github.com/search?q=author%3A${HANDLE}+is%3Apr+is%3Amerged+user%3Aaws+user%3AGetStream+user%3Ahyochan+user%3Asoftware-mansion&type=pullrequests`,
    },
    cv: {
      title: 'Mobile Lead',
      company: 'TradersClub',
      from: '04/2022',
      to: '04/2024',
    },
  },
  {
    era: 6,
    year: '2022',
    card: 'Author, eslint-plugin-react-usememo',
    when: '2022',
    org: 'eslint-plugin-react-usememo',
    role: 'open source',
    headline: `An ESLint plugin that makes wasted renders a lint error, downloaded ${fmt(stats.plugin.yearly)} times in the last 12 months.`,
    body: `Published in July 2022 and still maintained, now on version 3 after ${fmt(stats.plugin.releases)} releases.`,
    evidence: {
      label: 'on npm',
      href: `https://www.npmjs.com/package/${PLUGIN}`,
    },
  },
  {
    era: 5,
    year: '2021',
    card: 'Technical Lead Engineer, TradersClub',
    when: '2021 to 2022',
    org: 'TradersClub',
    role: 'Technical Lead Engineer',
    headline: 'Promoted to technical lead after ten months.',
    body: 'Wallet and Stocks products on web and mobile. Set the ESLint rules and testing structure for the team, and tuned the React Native builds for stability on both platforms.',
    cv: {
      title: 'Technical Lead Engineer',
      company: 'TradersClub',
      from: '07/2021',
      to: '04/2022',
    },
  },
  {
    era: 5,
    year: '2021',
    card: 'Speaker, React Conf Brasil',
    when: '2021',
    org: 'React Conf Brasil',
    role: 'speaker',
    headline: 'A conference talk on a Context that does not leak renders.',
    body: 'Components subscribe to the one slice they read. The library behind it is context-selector.',
    link: { label: 'Watch the talk', href: TALK },
    tail: ' (Portuguese, 28 minutes).',
    evidence: { label: 'repository', href: SELECTOR_REPO },
  },
  {
    era: 4,
    year: '2020',
    card: 'Frontend Engineer, TradersClub',
    when: '2020 to 2021',
    org: 'TradersClub',
    role: 'Frontend Engineer',
    headline: 'Web and mobile features in React, Next.js and React Native.',
    body: 'Custom ESLint rules written against the AST, and pipelines on Google Cloud.',
    cv: {
      title: 'Frontend Engineer',
      company: 'TradersClub',
      from: '09/2020',
      to: '07/2021',
    },
  },
  {
    era: 3,
    year: '2016',
    card: 'Software Engineer, Daitan Group',
    when: '2016 to 2020',
    org: 'Daitan Group',
    role: 'Software Engineer',
    headline:
      'Nearly four years building web products for VMware, BT and Alianza.',
    body: 'AngularJS and React frontends, Node.js services and AWS infrastructure. Interviewed frontend and backend candidates.',
    cv: {
      title: 'Software Engineer',
      company: 'Daitan Group',
      from: '12/2016',
      to: '09/2020',
    },
  },
  {
    era: 2,
    year: '2016',
    card: 'Intern, Trinity College Dublin',
    when: '2016',
    org: 'Trinity College Dublin',
    role: 'final-year project',
    headline: 'A time-tracking system built for BearingPoint.',
    body: 'Requirements agreed in weekly meetings with BearingPoint, ending with the old system replaced.',
    cv: {
      title: 'Intern',
      company: 'Trinity College Dublin',
      from: '01/2016',
      to: '07/2016',
    },
  },
  {
    era: 1,
    year: '2014',
    card: 'Test Engineer Intern, Dell',
    when: '2014 to 2015',
    org: 'Dell',
    role: 'Test Engineer Intern',
    headline:
      'First industry role: web systems and tools for the test engineering teams.',
    body: 'Alongside the degree, and while teaching algorithms and data structures as a teaching assistant.',
    cv: {
      title: 'Test Engineer Intern',
      company: 'Dell',
      from: '08/2014',
      to: '12/2015',
    },
  },
  {
    era: 0,
    year: '2013',
    card: 'Computer Science student',
    when: '2013',
    org: 'Instituto Federal de São Paulo',
    role: 'Computer Science',
    headline: 'Started the degree and opened a GitHub account the same year.',
    body: 'Graduated in 2017, with one year of it spent at Trinity College Dublin.',
  },
];
