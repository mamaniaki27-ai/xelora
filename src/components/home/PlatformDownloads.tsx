import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Laptop, Monitor, Smartphone } from 'lucide-react';

const platforms = [
  {
    id: 'windows',
    label: 'Windows',
    icon: Monitor,
    kicker: 'Optimized for Windows 10 & 11',
    note: 'Desktop build for the trading board, wallet preview, and market list.',
    headline: 'Trade and manage your Web3 assets on Windows.',
    compat: 'Compatible with supported Windows devices',
  },
  {
    id: 'mac',
    label: 'Mac',
    icon: Laptop,
    kicker: 'Optimized for macOS',
    note: 'Desktop build for Mac.',
    headline: 'Trade and manage your Web3 assets on Mac.',
    compat: 'Compatible with supported macOS devices',
  },
  {
    id: 'android',
    label: 'Android',
    icon: Smartphone,
    kicker: 'Optimized for Android phones & tablets',
    note: 'Mobile build for Android phones and tablets.',
    headline: 'Trade and manage your Web3 assets on Android.',
    compat: 'Compatible with supported Android devices',
  },
] as const;

const points = [
  'Connect your wallet with a simple and secure experience',
  'Track markets with real-time trading information',
  'Stay updated with important account activity',
];

export default function PlatformDownloads() {
  const [selectedId, setSelectedId] = useState<(typeof platforms)[number]['id']>('windows');
  const [notice, setNotice] = useState('');
  const [completedId, setCompletedId] = useState('');
  const timer = useRef(0);
  const selected = useMemo(() => platforms.find((item) => item.id === selectedId) ?? platforms[0], [selectedId]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function confirmDownload() {
    setCompletedId(selected.id);
    setNotice(`${selected.label} download complete.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setNotice('');
    }, 8000);
  }

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <div className="rounded-[1.75rem] border border-mint/25 bg-elev px-5 py-12 shadow-[0_0_80px_rgba(14,203,129,0.07)] sm:px-10">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-mint">Cross-platform access</p>
        <h2 className="mx-auto mt-4 max-w-xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Choose your platform.
          <span className="mt-1 block text-muted">Official client downloads</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-muted">
          Pick Windows, Mac, or Android. The download button confirms when the package is ready.
        </p>

        <div className="mt-8 flex justify-center" role="tablist" aria-label="Download platform">
          <div className="inline-flex rounded-full bg-soft p-1">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const active = selectedId === platform.id;
              return (
                <button
                  key={platform.id}
                  type="button"
                  role="tab"
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-mint text-mint-ink' : 'text-muted'}`}
                  aria-selected={active}
                  onClick={() => setSelectedId(platform.id)}
                >
                  <Icon className="h-4 w-4" />
                  {platform.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{selected.kicker}</p>
            <p className="mt-2 text-sm text-muted">{selected.note}</p>
            <h3 className="mt-5 max-w-md text-2xl font-bold tracking-tight">{selected.headline}</h3>
            <ul className="mt-5 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" className="mint-btn h-11 px-4" onClick={confirmDownload}>
                <Download className="h-4 w-4" />
                Download for {selected.label}
              </button>
              <p className="text-xs text-muted">{selected.compat}</p>
            </div>
          </div>

          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-line px-6 py-8 text-center">
            {completedId === selected.id ? (
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint/15 text-mint">
                  <Check className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold">Download complete</p>
              </div>
            ) : (
              <div>
                <Download className="mx-auto h-7 w-7 text-muted" />
                <p className="mt-4 font-semibold">{selected.label} package ready</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">Use the button to confirm this package.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {notice ? (
        <div
          className="fixed end-4 top-20 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border border-mint/40 bg-elev px-4 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
          role="status"
          aria-live="polite"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-mint-ink">
            <Check className="h-4 w-4" />
          </span>
          {notice}
        </div>
      ) : null}
    </section>
  );
}
