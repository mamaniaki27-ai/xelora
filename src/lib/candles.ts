export type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

const stepMinutes: Record<string, number> = {
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '30m': 30,
  '1H': 60,
  '4H': 240,
  '24H': 1440,
};

const volatility: Record<string, number> = {
  '1m': 0.0011,
  '5m': 0.0018,
  '15m': 0.0026,
  '30m': 0.0034,
  '1H': 0.0046,
  '4H': 0.0085,
  '24H': 0.014,
};

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed: number) {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function buildCandles(symbol: string, price: number, changePct: number, interval: string): Candle[] {
  const count = interval === '1m' ? 90 : interval === '24H' ? 60 : 72;
  const vol = volatility[interval] ?? 0.0046;
  const rand = random(hash(`${symbol}:${interval}`));
  const start = price / (1 + changePct / 100);
  const candles: Candle[] = [];
  let cursor = start;

  for (let index = 0; index < count; index += 1) {
    const remaining = count - index;
    const drift = (price - cursor) / remaining;
    const shock = (rand() - 0.5) * price * vol;
    const open = cursor;
    const close = Math.max(price * 0.15, open + drift + shock);
    const body = Math.abs(close - open);
    const upper = body * (0.25 + rand() * 0.7) + price * vol * 0.15 * rand();
    const lower = body * (0.2 + rand() * 0.65) + price * vol * 0.12 * rand();
    const high = Math.max(open, close) + upper;
    const low = Math.max(price * 0.1, Math.min(open, close) - lower);
    const volume = 40 + rand() * 80 + (body / (price * vol || 1)) * 30;
    cursor = close;
    candles.push({ open, close, high, low, volume });
  }

  const last = candles[candles.length - 1];
  last.close = price;
  last.high = Math.max(last.high, price);
  last.low = Math.min(last.low, price);
  return candles;
}

export function candleTimes(count: number, interval: string) {
  const minutes = stepMinutes[interval] ?? 60;
  const end = Date.UTC(2026, 10, 6, 6, 0);
  const indexes = [0, Math.floor((count - 1) / 2), count - 1];
  const spanMinutes = (count - 1) * minutes;
  return indexes.map((index) => {
    const at = new Date(end - (count - 1 - index) * minutes * 60_000);
    const label = spanMinutes >= 24 * 60
      ? at.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
      : at.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
    return { index, label };
  });
}
