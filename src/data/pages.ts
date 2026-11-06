export type PageId =
  | 'about'
  | 'token'
  | 'fees'
  | 'trading-fees'
  | 'security'
  | 'help'
  | 'status'
  | 'developers'
  | 'tools'
  | 'market-pulse'
  | 'funding-radar'
  | 'screener'
  | 'journal'
  | 'referrals'
  | 'announcements'
  | 'crypto-prices'
  | 'learn'
  | 'how-to-trade'
  | 'how-to-use-wallet'
  | 'guide'
  | 'blog'
  | 'press'
  | 'api-docs'
  | 'security-audit'
  | 'proof-of-reserves'
  | 'terms'
  | 'privacy'
  | 'risk'
  | 'compliance';

export type InfoPage = {
  id: PageId;
  path: string;
  title: string;
  lede: string;
};

export const infoPages: InfoPage[] = [
  { id: 'about', path: '/about', title: 'About', lede: 'XELORA is a non-custodial front end for spot markets, perpetual futures, and swaps. Keys stay in the wallet.' },
  { id: 'token', path: '/token', title: 'Token', lede: 'No token contract is deployed in this front-end pass. The page reserves the pre-launch layout.' },
  { id: 'fees', path: '/fees', title: 'Fees', lede: 'This preview does not add a platform fee. Trading fees will follow the upstream venue once execution is connected.' },
  { id: 'trading-fees', path: '/trading-fees', title: 'Trading fees', lede: 'Maker, taker, and funding costs belong to the venue. They are not calculated as a XELORA charge here.' },
  { id: 'security', path: '/security', title: 'Security', lede: 'The interface never asks for a seed phrase. Wallet signing is not wired up yet.' },
  { id: 'help', path: '/help', title: 'Help', lede: 'Use Markets to browse pairs, Trade to open the terminal, and Swap for a local quote.' },
  { id: 'status', path: '/status', title: 'System status', lede: 'Front-end preview is running locally. Upstream market connections are not monitored yet.' },
  { id: 'developers', path: '/developers', title: 'Developers', lede: 'There is no public trading API in this pass. Screens read a local market list.' },
  { id: 'tools', path: '/tools', title: 'Tools', lede: 'Calculator routes are reserved. The trading terminal is the working surface in this pass.' },
  { id: 'market-pulse', path: '/market-pulse', title: 'Market pulse', lede: 'A compact read of the local list: movers, volume, and funding.' },
  { id: 'funding-radar', path: '/funding-radar', title: 'Funding radar', lede: 'Funding and open interest from the sample perpetual list.' },
  { id: 'screener', path: '/screener', title: 'Indicator screener', lede: 'Screen layout is reserved for a later indicator pass.' },
  { id: 'journal', path: '/journal', title: 'Trading journal', lede: 'Preview positions from this browser can be reviewed in the terminal history.' },
  { id: 'referrals', path: '/referrals', title: 'Referrals', lede: 'Referral tracking is not part of the front-end shell.' },
  { id: 'announcements', path: '/announcements', title: 'Announcements', lede: 'No announcements are published in this environment.' },
  { id: 'crypto-prices', path: '/crypto-prices', title: 'Crypto prices', lede: 'Prices below are the local sample book used by the rest of the interface.' },
  { id: 'learn', path: '/learn', title: 'Learning center', lede: 'Lessons on crypto, charts, funding, and position size, with public video lectures.' },
  { id: 'how-to-trade', path: '/how-to-trade', title: 'Trading guide', lede: 'How spot, perpetual futures, and the swap ticket behave, including preview orders.' },
  { id: 'how-to-use-wallet', path: '/how-to-use-wallet', title: 'Wallet guide', lede: 'How the picker, a failed connection, and a signature fit together.' },
  { id: 'guide', path: '/guide', title: 'Guides & education', lede: 'How the header, search, favorites, Learn, the blog, and the calculators fit together.' },
  { id: 'blog', path: '/blog', title: 'Blog', lede: 'Desk notes on funding, wallets, position size, and how to read the market list.' },
  { id: 'press', path: '/press', title: 'Press', lede: 'No press kit is published.' },
  { id: 'api-docs', path: '/api-docs', title: 'API documentation', lede: 'A first-party trading API is not part of the front end.' },
  { id: 'security-audit', path: '/security-audit', title: 'Security audit', lede: 'No audit report is attached to this interface.' },
  { id: 'proof-of-reserves', path: '/proof-of-reserves', title: 'Proof of reserves', lede: 'The product is non-custodial. There is no platform balance to attest.' },
  { id: 'terms', path: '/terms', title: 'Terms of service', lede: 'Legal terms are not published in this front-end pass.' },
  { id: 'privacy', path: '/privacy', title: 'Privacy', lede: 'The preview stores theme, language, and a fake preview address in local storage on this device only.' },
  { id: 'risk', path: '/risk', title: 'Risk disclosure', lede: 'Perpetual trading can liquidate a position. This build only simulates that layout.' },
  { id: 'compliance', path: '/compliance', title: 'Compliance', lede: 'Region rules are not enforced in the preview.' },
];

export const footerGroups: { title: string; links: { label: string; path: string }[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Markets', path: '/markets' },
      { label: 'Spot Trading', path: '/spot' },
      { label: 'Perpetual Futures', path: '/futures' },
      { label: 'Swap', path: '/swap' },
      { label: 'Wallet', path: '/wallet' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Market Pulse', path: '/market-pulse' },
      { label: 'Funding Radar', path: '/funding-radar' },
      { label: 'Indicator Screener', path: '/screener' },
      { label: 'Trading Journal', path: '/journal' },
      { label: 'Referrals', path: '/referrals' },
      { label: 'Announcements', path: '/announcements' },
      { label: 'Crypto Prices', path: '/crypto-prices' },
    ],
  },
  {
    title: 'Popular Calculators',
    links: [
      { label: 'All Calculators', path: '/tools' },
      { label: 'Profit Calculator', path: '/tools/profit-calculator' },
      { label: 'Position & Risk', path: '/tools/position-risk-calculator' },
      { label: 'Liquidation Calculator', path: '/tools/liquidation-calculator' },
      { label: 'Futures PnL Calculator', path: '/tools/futures-pnl-calculator' },
      { label: 'Funding Rate Calculator', path: '/tools/funding-rate-calculator' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Learning Center', path: '/learn' },
      { label: 'Trading Guide', path: '/how-to-trade' },
      { label: 'Wallet Guide', path: '/how-to-use-wallet' },
      { label: 'Guides & Education', path: '/guide' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Xelo Token', path: '/token' },
      { label: 'Blog', path: '/blog' },
      { label: 'Press', path: '/press' },
    ],
  },
  {
    title: 'Developers & Support',
    links: [
      { label: 'API Documentation', path: '/api-docs' },
      { label: 'Developer Platform', path: '/developers' },
      { label: 'Help Center', path: '/help' },
      { label: 'System Status', path: '/status' },
      { label: 'Fees', path: '/fees' },
      { label: 'Trading Fees', path: '/trading-fees' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { label: 'Security', path: '/security' },
      { label: 'Security Audit', path: '/security-audit' },
      { label: 'Proof of Reserves', path: '/proof-of-reserves' },
      { label: 'Transparency', path: '/announcements' },
      { label: 'Compliance', path: '/compliance' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Risk Disclosure', path: '/risk' },
    ],
  },
];
