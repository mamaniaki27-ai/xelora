import { useMemo, useState } from 'react';

type Entry = {
  id: number;
  pair: string;
  side: 'long' | 'short';
  entry: number;
  exit: number;
  size: number;
  note: string;
  at: string;
};

const storageKey = 'xelora-journal';

function pnl(item: Entry) {
  const sign = item.side === 'long' ? 1 : -1;
  return (item.exit - item.entry) * item.size * sign;
}

function readEntries(): Entry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.pair === 'string' && typeof item.entry === 'number');
  } catch {
    return [];
  }
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>(readEntries);
  const [query, setQuery] = useState('');
  const [pair, setPair] = useState('BTC/USDC');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [entry, setEntry] = useState('100');
  const [exit, setExit] = useState('110');
  const [size, setSize] = useState('1');
  const [note, setNote] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((item) => !q || `${item.pair} ${item.side} ${item.note}`.toLowerCase().includes(q));
  }, [entries, query]);

  const stats = useMemo(() => {
    const rows = visible.map((item) => pnl(item));
    const wins = rows.filter((value) => value > 0).length;
    const net = rows.reduce((sum, value) => sum + value, 0);
    return {
      count: rows.length,
      winRate: rows.length ? (wins / rows.length) * 100 : 0,
      net,
    };
  }, [visible]);

  function add() {
    const entryNum = Number(entry);
    const exitNum = Number(exit);
    const sizeNum = Number(size);
    if (!pair.trim() || !entryNum || !exitNum || !sizeNum) return;
    const next = [{
      id: Date.now(),
      pair: pair.trim(),
      side,
      entry: entryNum,
      exit: exitNum,
      size: sizeNum,
      note: note.trim(),
      at: new Date().toISOString(),
    }, ...entries];
    setEntries(next);
    setNote('');
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function remove(id: number) {
    const next = entries.filter((item) => item.id !== id);
    setEntries(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Explore</p>
      <h1 className="mt-2 text-3xl font-semibold">Trading Journal</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        A private log of planned and closed trades. Entries stay in this browser. Nothing is sent to a server and nothing here places an order.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <article className="panel p-4"><p className="text-xs text-muted">Logged trades</p><p className="mt-1 text-2xl font-semibold num">{stats.count}</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Win rate</p><p className="mt-1 text-2xl font-semibold num">{stats.winRate.toFixed(1)}%</p></article>
        <article className="panel p-4"><p className="text-xs text-muted">Net result</p><p className={`mt-1 text-2xl font-semibold num ${stats.net < 0 ? 'text-ask' : 'text-bid'}`}>{stats.net.toFixed(2)}</p></article>
      </div>

      <form
        className="panel mt-4 grid gap-3 p-4 md:grid-cols-6"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <label className="text-sm md:col-span-2">
          <span className="text-xs text-muted">Pair</span>
          <input value={pair} onChange={(event) => setPair(event.target.value)} className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
        </label>
        <label className="text-sm">
          <span className="text-xs text-muted">Side</span>
          <select value={side} onChange={(event) => setSide(event.target.value as 'long' | 'short')} className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3">
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-xs text-muted">Entry</span>
          <input value={entry} onChange={(event) => setEntry(event.target.value)} inputMode="decimal" className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
        </label>
        <label className="text-sm">
          <span className="text-xs text-muted">Exit</span>
          <input value={exit} onChange={(event) => setExit(event.target.value)} inputMode="decimal" className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
        </label>
        <label className="text-sm">
          <span className="text-xs text-muted">Size</span>
          <input value={size} onChange={(event) => setSize(event.target.value)} inputMode="decimal" className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
        </label>
        <label className="text-sm md:col-span-5">
          <span className="text-xs text-muted">Note</span>
          <input value={note} onChange={(event) => setNote(event.target.value)} className="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" placeholder="Setup, invalidation, what you would repeat" />
        </label>
        <button type="submit" className="mint-btn h-10 self-end">Save trade</button>
      </form>

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="w-full max-w-sm">
          <span className="sr-only">Search journal</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field h-10 rounded-xl border border-line bg-elev px-3 text-sm" placeholder="Search pair, side, or note" />
        </label>
        <p className="text-xs text-muted">{visible.length} shown</p>
      </div>

      <div className="panel mt-3 overflow-x-auto">
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">No journal rows yet. Save a closed trade to start the log.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2 text-start font-medium">When</th>
                <th className="px-3 py-2 text-start font-medium">Pair</th>
                <th className="px-3 py-2 text-start font-medium">Side</th>
                <th className="px-3 py-2 text-end font-medium">Entry</th>
                <th className="px-3 py-2 text-end font-medium">Exit</th>
                <th className="px-3 py-2 text-end font-medium">Result</th>
                <th className="px-3 py-2 text-start font-medium">Note</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-3 py-3 text-muted">{new Date(item.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-3 py-3 font-semibold">{item.pair}</td>
                  <td className={`px-3 py-3 capitalize ${item.side === 'long' ? 'text-bid' : 'text-ask'}`}>{item.side}</td>
                  <td className="px-3 py-3 text-end num">{item.entry}</td>
                  <td className="px-3 py-3 text-end num">{item.exit}</td>
                  <td className={`px-3 py-3 text-end num ${pnl(item) < 0 ? 'text-ask' : 'text-bid'}`}>{pnl(item).toFixed(2)}</td>
                  <td className="px-3 py-3 text-muted">{item.note || '—'}</td>
                  <td className="px-3 py-3 text-end"><button type="button" className="text-xs text-muted" onClick={() => remove(item.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
