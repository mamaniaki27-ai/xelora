import type { MarketKind } from '../data/markets';

export function tradePath(symbol: string, kind: MarketKind) {
  const slug = `${symbol.toLowerCase()}-usdc`;
  return kind === 'perp' ? `/trade/${slug}-futures` : `/trade/${slug}`;
}

export function parseTradePath(path: string): { symbol: string; kind: MarketKind } | null {
  const match = path.match(/^\/trade\/([a-z0-9]+)-usdc(-futures)?$/i);
  if (!match) return null;
  return {
    symbol: match[1].toUpperCase(),
    kind: match[2] ? 'perp' : 'spot',
  };
}
