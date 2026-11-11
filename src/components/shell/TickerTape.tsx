import { useMemo } from 'react';
import CoinIcon from '../CoinIcon';
import { tickerFeed } from '../../data/ticker';
import { changeClass, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';

export default function TickerTape() {
  const tick = useLiveTick();

  const items = useMemo(
    () =>
      tickerFeed.map((item) => ({
        ...item,
        live: wobble(item.price, item.symbol.length),
      })),
    [tick],
  );

  const loop = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="ticker-mask border-b border-line bg-bg">
      <div className="ticker-track">
        {loop.map((item, index) => (
          <span key={`${item.symbol}-${index}`} className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold">
            <CoinIcon symbol={item.symbol} size={16} />
            <span className="text-ink">{item.symbol}</span>
            <span className="num text-ink/80">{formatPrice(item.live)}</span>
            <span className={`num ${changeClass(item.change)}`}>{formatSigned(item.change)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
