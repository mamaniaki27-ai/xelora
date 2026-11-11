import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import VideoFrame from '../learn/VideoFrame';
import { courseLesson } from '../../data/course';
import { tradingGuide } from '../../data/trading-guide';
import { walletGuide } from '../../data/wallet-guide';
import { studyGuide } from '../../data/study-guide';

const catalogs = {
  'how-to-trade': tradingGuide,
  'how-to-use-wallet': walletGuide,
  guide: studyGuide,
};

function catalogFor(section: string) {
  if (section === 'how-to-trade' || section === 'how-to-use-wallet' || section === 'guide') return catalogs[section];
  return undefined;
}

export default function CoursePage() {
  const location = useLocation();
  const section = location.pathname.split('/').filter(Boolean)[0] ?? '';
  const course = useMemo(() => catalogFor(section), [section]);
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('All');
  const [activeVideo, setActiveVideo] = useState('');

  useEffect(() => {
    setQuery('');
    setTrack('All');
    setActiveVideo(course?.videos[0]?.id ?? '');
  }, [course]);

  const tracks = useMemo(() => ['All', ...(course?.tracks ?? [])], [course]);
  const visible = useMemo(() => {
    if (!course) return [];
    const term = query.trim().toLowerCase();
    return course.lessons.filter((lesson) => {
      if (track !== 'All' && lesson.track !== track) return false;
      if (!term) return true;
      return `${lesson.title} ${lesson.summary} ${lesson.track}`.toLowerCase().includes(term);
    });
  }, [course, query, track]);
  const pathLessons = useMemo(() => {
    if (!course) return [];
    return course.path.flatMap((slug) => {
      const lesson = courseLesson(course, slug);
      return lesson ? [lesson] : [];
    });
  }, [course]);
  const playing = useMemo(
    () => course?.videos.find((video) => video.id === activeVideo) ?? course?.videos[0],
    [course, activeVideo],
  );

  if (!course || !playing) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Guide not found</h1>
        <Link to="/learn" className="mint-btn mt-6">Learning center</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">{course.eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{course.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{course.lede}</p>

      <form className="mt-6 max-w-xl" role="search" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span className="sr-only">Search {course.eyebrow}</span>
          <input
            className="field w-full rounded-xl border border-line bg-elev px-4 py-3"
            placeholder={course.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </form>

      <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Start here</p>
          <ol className="mt-4 list-none space-y-4 p-0">
            {pathLessons.map((lesson, index) => (
              <li key={lesson.slug}>
                <Link to={`${course.base}/${lesson.slug}`} className="flex gap-3 rounded-xl hover:text-mint">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mint text-sm font-bold text-mint-ink">{index + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{lesson.title}</span>
                    <span className="mt-1 block text-xs text-muted">{lesson.track} · {lesson.minutes} min</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <figure className="panel overflow-hidden">
          <img src={course.heroImage} alt={course.heroAlt} className="h-full max-h-80 w-full object-cover" />
          <figcaption className="px-4 py-3 text-[11px] text-muted">{course.heroCaption}</figcaption>
        </figure>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={`${course.eyebrow} tracks`}>
        {tracks.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${track === item ? 'bg-mint text-mint-ink' : 'bg-elev text-muted'}`}
            aria-selected={track === item}
            onClick={() => setTrack(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No lesson matches this search or track.</p>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {visible.map((lesson) => (
            <Link key={lesson.slug} to={`${course.base}/${lesson.slug}`} className="panel overflow-hidden transition hover:border-mint/40">
              <img src={lesson.image} alt={lesson.imageAlt} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mint">{lesson.track} · {lesson.minutes} min</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug">{lesson.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{lesson.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Watch</p>
        <h2 className="mt-2 text-2xl font-semibold">Public lectures on YouTube</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          These lectures are hosted by their authors. The lessons above name the controls on XELORA. A phrase shown in a video belongs to that demonstration.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <VideoFrame id={playing.id} title={`${playing.title} by ${playing.channel}`} />
            <p className="mt-3 text-sm font-semibold">{playing.title}</p>
            <p className="mt-1 text-xs text-muted">{playing.channel} · {playing.note}</p>
          </div>
          <div className="grid content-start gap-3" role="list">
            {course.videos.map((video) => (
              <button
                key={video.id}
                type="button"
                className={`panel flex gap-3 p-2 text-left ${video.id === playing.id ? 'border-mint' : ''}`}
                aria-pressed={video.id === playing.id}
                onClick={() => setActiveVideo(video.id)}
              >
                <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" className="h-16 w-28 shrink-0 rounded-lg object-cover" />
                <span>
                  <span className="block text-sm font-semibold leading-snug">{video.title}</span>
                  <span className="mt-1 block text-xs text-muted">{video.channel}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold">Terms on this desk</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {course.terms.map((item) => (
            <div key={item.term} className="panel p-4">
              <dt className="text-sm font-semibold">{item.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
