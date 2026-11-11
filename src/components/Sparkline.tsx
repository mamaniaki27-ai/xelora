import { useMemo } from 'react';
import { buildCandles } from '../lib/candles';

export default function Sparkline({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const points = useMemo(() => {
    const closes = buildCandles(symbol, price, change, '1H').slice(-20).map((bar) => bar.close);
    const max = Math.max(...closes);
    const min = Math.min(...closes);
    const span = max - min || 1;
    return closes.map((value, index) => `${index * 3.6},${2 + ((max - value) / span) * 28}`).join(' ');
  }, [symbol, price, change]);

  return (
    <svg viewBox="0 0 70 32" className="h-8 w-[70px]" aria-hidden="true">
      <polyline
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={change >= 0 ? 'var(--bid)' : 'var(--ask)'}
        points={points}
      />
    </svg>
  );
}
