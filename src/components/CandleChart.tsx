import { useEffect, useMemo, useRef, useState, type MouseEvent, type WheelEvent } from 'react';
import { type Candle } from '../lib/candles';
import { formatPrice } from '../lib/format';

const stepMinutes: Record<string, number> = {
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1H': 60,
  '4H': 240,
  '24H': 1440,
};

export default function CandleChart({
  candles,
  interval,
  mark,
  className,
}: {
  candles: Candle[];
  interval: string;
  mark?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [windowCount, setWindowCount] = useState(0);
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);

  const visible = useMemo(() => {
    const bars = candles;
    const size = Math.max(20, Math.min(bars.length, windowCount || bars.length));
    const start = bars.length - size;
    return { bars: bars.slice(start), start, size };
  }, [candles, windowCount]);

  const frame = useMemo(() => {
    const bars = visible.bars;
    const width = 860;
    const padL = 8;
    const padR = 78;
    const padT = 16;
    const priceH = 236;
    const gap = 14;
    const volH = 52;
    const height = padT + priceH + gap + volH + 24;
    const plotW = width - padL - padR;
    const markPrice = mark ?? bars[bars.length - 1].close;
    const hi = Math.max(...bars.map((bar) => bar.high), markPrice);
    const lo = Math.min(...bars.map((bar) => bar.low), markPrice);
    const pad = (hi - lo) * 0.08 || hi * 0.01;
    const top = hi + pad;
    const span = hi - lo + pad * 2 || 1;
    const yOf = (value: number) => padT + ((top - value) / span) * priceH;
    const slot = plotW / bars.length;
    const bodyW = Math.max(3.5, Math.min(9, slot * 0.62));
    const maxVol = Math.max(...bars.map((bar) => bar.volume));
    const volTop = padT + priceH + gap;
    const minutes = stepMinutes[interval] ?? 60;
    const end = Date.UTC(2026, 10, 6, 6, 0);
    const total = candles.length;

    const sma = bars.map((_, index) => {
      const slice = bars.slice(Math.max(0, index - 11), index + 1);
      return slice.reduce((sum, bar) => sum + bar.close, 0) / slice.length;
    });

    const plotted = bars.map((bar, index) => {
      const x = padL + slot * index + slot / 2;
      const up = bar.close >= bar.open;
      const yOpen = yOf(bar.open);
      const yClose = yOf(bar.close);
      const absolute = visible.start + index;
      const at = new Date(end - (total - 1 - absolute) * minutes * 60_000);
      return {
        x,
        up,
        yHigh: yOf(bar.high),
        yLow: yOf(bar.low),
        y: Math.min(yOpen, yClose),
        h: Math.max(1.4, Math.abs(yClose - yOpen)),
        vol: (bar.volume / maxVol) * volH,
        volY: volTop + volH - (bar.volume / maxVol) * volH,
        open: bar.open,
        close: bar.close,
        high: bar.high,
        low: bar.low,
        volume: bar.volume,
        time: at.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }),
      };
    });

    const levels = Array.from({ length: 5 }, (_, index) => {
      const value = top - (span * index) / 4;
      return { value, y: yOf(value) };
    });

    const stamps = [0, Math.floor((bars.length - 1) / 2), bars.length - 1].map((index) => ({
      label: plotted[index].time,
      x: plotted[index].x,
    }));

    const smaPath = sma
      .map((value, index) => `${index === 0 ? 'M' : 'L'} ${padL + slot * index + slot / 2} ${yOf(value).toFixed(2)}`)
      .join(' ');

    const last = bars[bars.length - 1];
    return {
      width,
      height,
      padL,
      padR,
      padT,
      priceH,
      top,
      span,
      slot,
      candles: plotted,
      bodyW,
      levels,
      stamps,
      smaPath,
      volTop,
      lastY: yOf(markPrice),
      lastUp: markPrice >= last.open,
      mark: markPrice,
      axisX: width - padR + 6,
      plotRight: width - padR,
    };
  }, [candles, interval, mark, visible]);

  const tip = useMemo(() => {
    if (!hover) return null;
    const bar = frame.candles[hover.index];
    if (!bar) return null;
    const price = frame.top - ((hover.y - frame.padT) / frame.priceH) * frame.span;
    return { ...bar, price };
  }, [frame, hover]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const prevent = (event: Event) => {
      event.preventDefault();
    };
    node.addEventListener('wheel', prevent, { passive: false });
    return () => node.removeEventListener('wheel', prevent);
  }, []);

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    const step = event.deltaY > 0 ? 10 : -10;
    setWindowCount((current) => Math.max(20, Math.min(candles.length, (current || candles.length) + step)));
    setHover(null);
  }

  function onMove(event: MouseEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * frame.width;
    const y = ((event.clientY - rect.top) / rect.height) * frame.height;
    const index = Math.round((x - frame.padL) / frame.slot - 0.5);
    if (index < 0 || index >= frame.candles.length || y < frame.padT || y > frame.volTop) {
      setHover(null);
      return;
    }
    setHover({ index, x: frame.candles[index].x, y });
  }

  return (
    <div
      ref={rootRef}
      className={className ? `relative h-full min-h-[280px] ${className}` : 'relative h-full min-h-[280px]'}
      onWheel={onWheel}
    >
      <svg
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        className="h-full min-h-[280px] w-full"
        role="img"
        aria-label="Price chart"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {frame.levels.map((level) => (
          <line key={level.y} x1="0" x2={frame.plotRight} y1={level.y} y2={level.y} stroke="var(--line)" />
        ))}
        <line x1="0" x2={frame.plotRight} y1={frame.volTop} y2={frame.volTop} stroke="var(--line)" />
        {frame.candles.map((bar, index) => (
          <g key={index}>
            <line x1={bar.x} x2={bar.x} y1={bar.yHigh} y2={bar.yLow} stroke={bar.up ? 'var(--bid)' : 'var(--ask)'} strokeWidth="1.25" />
            <rect x={bar.x - frame.bodyW / 2} y={bar.y} width={frame.bodyW} height={bar.h} fill={bar.up ? 'var(--bid)' : 'var(--ask)'} rx="0.6" />
            <rect x={bar.x - frame.bodyW / 2} y={bar.volY} width={frame.bodyW} height={bar.vol} fill={bar.up ? 'var(--bid)' : 'var(--ask)'} opacity="0.45" rx="0.6" />
          </g>
        ))}
        <path d={frame.smaPath} fill="none" stroke="#e0b84d" strokeWidth="1.35" />
        <line x1="0" x2={frame.plotRight} y1={frame.lastY} y2={frame.lastY} stroke={frame.lastUp ? 'var(--bid)' : 'var(--ask)'} strokeDasharray="3 3" strokeWidth="1" />
        {hover && tip ? (
          <g>
            <line x1={hover.x} x2={hover.x} y1={frame.padT} y2={frame.volTop} stroke="#eaecef" strokeOpacity="0.75" strokeDasharray="3 3" />
            <line x1="0" x2={frame.plotRight} y1={hover.y} y2={hover.y} stroke="#eaecef" strokeOpacity="0.75" strokeDasharray="3 3" />
            <rect x={frame.axisX - 4} y={hover.y - 9} width="70" height="18" rx="3" fill="var(--ink)" />
            <text x={frame.axisX} y={hover.y + 4} fill="var(--bg)" fontSize="11" fontWeight="700" fontFamily="Segoe UI, sans-serif">
              {formatPrice(tip.price)}
            </text>
          </g>
        ) : null}
        {frame.levels.map((level) => (
          <g key={`p${level.y}`}>
            {Math.abs(level.y - frame.lastY) > 16 ? (
              <text x={frame.axisX} y={level.y + 3} fill="var(--muted)" fontSize="11" fontFamily="Segoe UI, sans-serif">
                {formatPrice(level.value)}
              </text>
            ) : null}
          </g>
        ))}
        <rect x={frame.axisX - 4} y={frame.lastY - 9} width="70" height="18" rx="3" fill={frame.lastUp ? 'var(--bid)' : 'var(--ask)'} />
        <text x={frame.axisX} y={frame.lastY + 4} fill={frame.lastUp ? '#04140e' : '#ffffff'} fontSize="11" fontWeight="700" fontFamily="Segoe UI, sans-serif">
          {formatPrice(frame.mark)}
        </text>
        {frame.stamps.map((stamp) => (
          <text key={stamp.label + stamp.x} x={stamp.x} y={frame.height - 6} fill="var(--muted)" fontSize="11" textAnchor="middle" fontFamily="Segoe UI, sans-serif">
            {stamp.label}
          </text>
        ))}
      </svg>
      {tip ? (
        <div
          className="pointer-events-none absolute z-10 min-w-40 rounded-lg border border-line bg-elev/95 px-3 py-2 text-[11px] shadow-lg"
          style={{ left: '12px', top: '12px' }}
        >
          <p className="font-semibold text-ink">{tip.time} UTC</p>
          <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 num text-muted">
            <div>O <span className="text-ink">{formatPrice(tip.open)}</span></div>
            <div>H <span className="text-bid">{formatPrice(tip.high)}</span></div>
            <div>L <span className="text-ask">{formatPrice(tip.low)}</span></div>
            <div>C <span className="text-ink">{formatPrice(tip.close)}</span></div>
            <div className="col-span-2">Vol <span className="text-ink">{tip.volume.toFixed(1)}</span></div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
