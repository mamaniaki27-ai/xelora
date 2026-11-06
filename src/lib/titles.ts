import { infoPages, type PageId } from '../data/pages';

const titles = new Map<string, string>([
  ['/', 'XELORA | Non-custodial markets, futures and swaps'],
  ['/markets', 'Markets | XELORA'],
  ['/futures', 'Perpetual futures | XELORA'],
  ['/spot', 'Spot | XELORA'],
  ['/swap', 'Swap | XELORA'],
  ['/wallet', 'Wallet | XELORA'],
  ['/market-pulse', 'Market pulse | XELORA'],
  ['/funding-radar', 'Funding radar | XELORA'],
  ['/crypto-prices', 'Crypto prices | XELORA'],
]);

for (const page of infoPages) {
  titles.set(page.path, `${page.title} | XELORA`);
}

export function titleFor(path: string) {
  if (titles.has(path)) return titles.get(path)!;
  if (path.startsWith('/trade/')) return 'Trade | XELORA';
  if (path.startsWith('/blog/')) return 'Blog | XELORA';
  if (path.startsWith('/learn/')) return 'Learning center | XELORA';
  if (path.startsWith('/how-to-trade/')) return 'Trading guide | XELORA';
  if (path.startsWith('/how-to-use-wallet/')) return 'Wallet guide | XELORA';
  if (path.startsWith('/guide/')) return 'Guides & education | XELORA';
  if (path.startsWith('/tools/')) return 'Calculator | XELORA';
  return 'XELORA';
}

export function isKnownPath(path: string) {
  return titles.has(path) || path.startsWith('/trade/');
}

export type { PageId };
