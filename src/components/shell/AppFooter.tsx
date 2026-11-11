import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';
import { footerGroups } from '../../data/pages';
import { useUiStore } from '../../stores/ui';

export default function AppFooter() {
  const ui = useUiStore();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-14">
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 text-mint">
            <LogoMark />
            <span className="text-2xl font-extrabold tracking-[0.08em] text-ink">XELORA</span>
          </Link>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{ui.t('footer.tagline')}</p>
        </div>

        <div className="mt-8 border-t border-line pt-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.path + link.label}>
                      <Link to={link.path} className="text-sm text-muted hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line py-5">
          <p className="text-xs uppercase tracking-wide text-muted">© 2026 XELORA. All rights reserved.</p>
          <Link
            to="/status"
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            System status
          </Link>
        </div>
      </div>
    </footer>
  );
}
