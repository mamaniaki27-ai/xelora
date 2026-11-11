import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toolCategoryLabel, toolPath, tools, type ToolCategory } from '../../data/tools';

const chips: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'risk', label: 'Trading & risk' },
  { id: 'market', label: 'Market & valuation' },
  { id: 'yield', label: 'Yield & funding' },
];

export default function ToolsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');

  const counts = useMemo(() => ({
    all: tools.length,
    risk: tools.filter((tool) => tool.category === 'risk').length,
    market: tools.filter((tool) => tool.category === 'market').length,
    yield: tools.filter((tool) => tool.category === 'yield').length,
  }), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools
      .filter((tool) => (category === 'all' ? true : tool.category === category))
      .filter((tool) => !q || `${tool.title} ${tool.summary} ${toolCategoryLabel[tool.category]}`.toLowerCase().includes(q));
  }, [query, category]);

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <p className="text-sm text-muted">Tools</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Smart tools for smarter trades</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Calculators for entries, risk, and funding. Each result is computed from the numbers you enter on this device.
      </p>

      <form className="mt-6" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="sr-only">Search calculators</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="field h-11 rounded-lg border border-line bg-elev px-4" placeholder="e.g. funding, risk, token price" />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`inline-flex h-8 items-center rounded px-3 text-xs font-semibold ${category === chip.id ? 'bg-mint text-mint-ink' : 'border border-line text-muted'}`}
              onClick={() => setCategory(chip.id)}
            >
              {chip.label} ({counts[chip.id]})
            </button>
          ))}
        </div>
      </form>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((tool) => (
          <Link
            key={tool.slug}
            to={toolPath(tool.slug)}
            className="block rounded-lg border border-line bg-elev/40 p-4 hover:border-mint"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-mint">{toolCategoryLabel[tool.category]}</p>
            <h2 className="mt-2 text-lg font-semibold">{tool.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{tool.summary}</p>
          </Link>
        ))}
      </div>
      {rows.length === 0 ? <p className="py-10 text-center text-sm text-muted">No calculator matches that search.</p> : null}
    </section>
  );
}
