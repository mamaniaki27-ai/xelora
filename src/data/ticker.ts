import { markets } from './markets';

const seen = new Set<string>();

export const tickerFeed = markets
  .filter((market) => market.kind === 'perp')
  .slice()
  .sort((a, b) => b.volume - a.volume)
  .filter((market) => {
    const key = market.symbol.toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .slice(0, 36)
  .map((market) => ({
    symbol: `${market.symbol.toUpperCase()}USDT`,
    price: market.price,
    change: market.change,
  }));
