import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogCategories, blogPosts, type BlogCategory } from '../../data/blog';

const trending = [
  { label: 'Trade Futures', to: '/futures' },
  { label: 'Free Tools', to: '/tools' },
  { label: 'Crypto Prices', to: '/crypto-prices' },
  { label: 'Trading Fees', to: '/trading-fees' },
  { label: 'Proof of Reserves', to: '/proof-of-reserves' },
  { label: 'Security Audit', to: '/security-audit' },
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<BlogCategory | 'All'>('All');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      if (category !== 'All' && post.category !== category) return false;
      if (!term) return true;
      return `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(term);
    });
  }, [query, category]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Web3 Insights</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Discover the future of crypto</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Notes from the desk on funding, position size, wallets, and how to read the market list. The write-ups summarize public guides. They are not trade signals.
      </p>

      <form className="mt-6 max-w-xl" role="search" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span className="sr-only">Search articles</span>
          <input
            className="field w-full rounded-xl border border-line bg-elev px-4 py-3"
            placeholder="Search articles, tokens, or trends"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </form>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Article categories">
        {blogCategories.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${category === item ? 'bg-mint text-mint-ink' : 'bg-elev text-muted'}`}
            aria-selected={category === item}
            onClick={() => setCategory(item)}
          >
            {item === 'All' ? 'All' : item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No published posts match this search or category.</p>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {visible.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="panel overflow-hidden transition hover:border-mint/40"
            >
              <img src={post.image} alt={post.imageAlt} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint">{post.category}</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                <p className="mt-3 text-xs text-muted">{formatDate(post.date)} · XELORA Research</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">XELORA newsletter</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Occasional product and security notes would go here. Signup is not enabled. No email is collected, and no trading or wallet data is attached.
          </p>
        </article>
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Trending now</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {trending.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-ink">{item.label}</Link>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <h2 className="font-semibold">Non-custodial design</h2>
          <p className="mt-2 text-sm text-muted">The interface asks a wallet to sign. It does not hold the assets or the recovery phrase.</p>
        </article>
        <article className="panel p-4">
          <h2 className="font-semibold">Wallet-first access</h2>
          <p className="mt-2 text-sm text-muted">Connect a supported wallet to review balances and preview orders in this browser.</p>
        </article>
        <article className="panel p-4">
          <h2 className="font-semibold">Built for Web3 trading</h2>
          <p className="mt-2 text-sm text-muted">Spot, perpetuals, and swaps share one market list, one journal, and one set of calculators.</p>
        </article>
      </div>
    </section>
  );
}
