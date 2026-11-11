import { useEffect, useMemo, useState } from 'react';
import { coinFiles } from '../data/coin-files';

export default function CoinIcon({ symbol, size = 32, bare = false }: { symbol: string; size?: number; bare?: boolean }) {
  const key = useMemo(() => {
    const upper = symbol.toUpperCase();
    if (coinFiles[upper]) return upper;
    return upper.replace(/USDT|USDC|USD/gi, '');
  }, [symbol]);
  const [src, setSrc] = useState('/coins/default.png');

  useEffect(() => {
    const file = coinFiles[key];
    setSrc(file ? `/coins/${file}` : '/coins/default.png');
  }, [key]);

  return (
    <img
      src={src}
      width={size}
      height={size}
      className={bare ? 'h-full w-full object-contain p-0.5' : 'shrink-0 rounded-full bg-soft object-contain'}
      alt={`${key} logo`}
      onError={() => setSrc('/coins/default.png')}
    />
  );
}
