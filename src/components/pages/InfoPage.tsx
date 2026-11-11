import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pageSections } from '../../data/sections';
import { infoPages } from '../../data/pages';

export default function InfoPage() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const page = useMemo(() => infoPages.find((item) => item.path === location.pathname), [location.pathname]);
  const sections = useMemo(
    () => pageSections[location.pathname] ?? (page ? [{ title: page.title, body: page.lede }] : []),
    [location.pathname, page],
  );
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.filter((section) => !q || `${section.title} ${section.body}`.toLowerCase().includes(q));
  }, [query, sections]);

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-muted">That route is not part of this front end.</p>
        <Link to="/" className="mint-btn mt-6">Home</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">XELORA</p>
      <h1 className="mt-2 text-4xl font-semibold">{page.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{page.lede}</p>
      <form className="mt-5" role="search" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span className="sr-only">Search {page.title}</span>
          <input
            className="field w-full rounded-xl border border-line bg-elev px-4 py-2.5"
            placeholder={`Search ${page.title.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </form>
      {visible.map((section) => (
        <article key={section.title} className="panel mt-3 p-4">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
        </article>
      ))}
      {visible.length === 0 ? <p className="py-8 text-center text-sm text-muted">Nothing on this page matches that search.</p> : null}
      <Link to="/markets" className="ghost-btn mt-6">Back to markets</Link>
    </section>
  );
}
