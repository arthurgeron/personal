import type { Company, Link, Upstream } from '../types/interfaces';
import { fmt } from '../utils/format';
import { stats } from '../utils/stats';

export const HANDLE = 'arthurgeron';
export const SITE = 'https://arthurgeron.com';
export const GITHUB = `https://github.com/${HANDLE}`;
export const LINKEDIN = `https://www.linkedin.com/in/${HANDLE}`;
export const PLUGIN = `@${HANDLE}/eslint-plugin-react-usememo`;
export const PLUGIN_REPO = `${GITHUB}/eslint-plugin-react-usememo`;
export const SELECTOR_REPO = `${GITHUB}/context-selector`;
export const TALK = 'https://www.youtube.com/watch?v=ygAPGBpOkmw';

const MERGED = `author%3A${HANDLE}+is%3Apr+is%3Amerged`;

export const orgSearch = (org: string) =>
  `https://github.com/search?q=org%3A${org}+${MERGED}&type=pullrequests`;

export const NAV: Link[] = [
  { label: '13 years', href: '#years' },
  { label: '60 fps', href: '#sixty' },
  { label: 'Open source', href: '#oss' },
  { label: 'Web3', href: '#web3' },
  { label: 'Hire me', href: '#hire' },
  { label: 'Say hi', href: '#contact' },
];

export const HINTS = ['move the cursor', 'click anywhere', 'scroll', '⌘K'];

export const WORKED_AT: Company[] = [
  { name: 'Blueprint Finance', note: 'Frontend Lead', tag: 'BF' },
  { name: 'Fuel Labs', note: 'Senior Frontend Developer', tag: 'FL' },
  { name: 'TradersClub', note: 'Mobile Lead', tag: 'TC' },
  { name: 'Daitan Group', note: 'Software Engineer', tag: 'DG' },
  { name: 'VMware', note: 'client work at Daitan', tag: 'VM' },
  { name: 'BT', note: 'client work at Daitan', tag: 'BT' },
  { name: 'Alianza', note: 'client work at Daitan', tag: 'AL' },
  { name: 'Dell', note: 'Test Engineer Intern', tag: 'DE' },
  {
    name: 'Trinity College Dublin',
    note: 'final-year project for BearingPoint',
    tag: 'TCD',
  },
];

export const MERGED_INTO: Company[] = [
  { name: 'AWS', note: 'Amazon IVS player for React Native' },
  { name: 'Software Mansion', note: 'Reanimated' },
  { name: 'Stream', note: 'chat SDK for React Native' },
  { name: 'React Native Community', note: 'hooks' },
  { name: 'react-native-iap', note: '3 StoreKit fixes' },
  { name: 'Fuel Labs', note: 'wallet, connectors, explorer, bridge' },
  { name: 'Berachain', note: 'PoL vault adapters' },
  { name: 'TenKeyLabs', note: 'dappwright' },
  { name: 'Swaylend', note: 'Fuel SDK refactor' },
  { name: 'Thunder', note: 'frontend and contracts' },
];

export const UPSTREAM: Upstream[] = [
  {
    name: 'AWS',
    repo: 'aws/amazon-ivs-react-native-player',
    what: 'Picture-in-Picture fix and exported prop types',
  },
  {
    name: 'Software Mansion',
    repo: 'software-mansion/react-native-reanimated',
    what: 'Fixed output data type not matching input data',
  },
  {
    name: 'Stream',
    repo: 'GetStream/stream-chat-react-native',
    what: 'Android permission picker loop fix, Portuguese translation',
  },
  {
    name: 'react-native-iap',
    repo: 'hyochan/react-native-iap',
    what: 'Three StoreKit 1 crash and race condition fixes',
  },
  {
    name: 'React Native Community',
    repo: 'react-native-community/hooks',
    what: 'Exported the AppStateStatus type',
  },
  {
    name: 'Fuel Labs',
    repo: 'FuelLabs',
    what: `${fmt(stats.fuelPrs)} merged pull requests across the wallet, connectors, explorer and bridge`,
    query: orgSearch('FuelLabs'),
  },
  {
    name: 'Berachain',
    repo: 'berachain/hub-pol-adapters',
    what: 'Vault adapters for Berachain tokens',
  },
  {
    name: 'TenKeyLabs',
    repo: 'TenKeyLabs/dappwright',
    what: 'Added updateNetworkRpc for wallet end-to-end tests',
  },
  {
    name: 'Swaylend',
    repo: 'Swaylend/swaylend-monorepo',
    what: 'Fuel SDK implementation refactor',
  },
  {
    name: 'Thunder',
    repo: 'ThunderFuel',
    what: 'A bulk order fix and an SDK update',
    query: orgSearch('ThunderFuel'),
  },
];

export const upstreamHref = ({ repo, query }: Upstream) =>
  query ??
  `https://github.com/${repo}/pulls?q=is%3Apr+is%3Amerged+author%3A${HANDLE}`;

export const SERVICES = [
  {
    when: 'the app feels slow and nobody can say why.',
    service: 'Performance audit',
  },
  {
    when: 'the codebase fights every change.',
    service: 'Frontend architecture',
  },
  { when: "a Web3 launch can't slip.", service: 'Hands-on delivery' },
  {
    when: 'your team wants AI agents writing code without wrecking quality.',
    service: 'Engineering workflow',
  },
];

export const TX_IDLE = 'Simulated devnet. Nothing leaves this page.';
export const DEMO_SIZES = [
  { cols: 24, rows: 14 },
  { cols: 60, rows: 35 },
  { cols: 120, rows: 70 },
];
