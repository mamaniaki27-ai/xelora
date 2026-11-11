import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import VideoFrame from '../learn/VideoFrame';
import { learnLesson, learnLessons, learnVideo } from '../../data/learn';

export default function LearnLesson() {
  const { slug } = useParams();
  const lesson = useMemo(() => learnLesson(String(slug ?? '')), [slug]);
  const related = useMemo(
    () => learnLessons.filter((item) => item.slug !== lesson?.slug && item.track === lesson?.track).slice(0, 2),
    [lesson],
  );
  const video = useMemo(() => (lesson?.videoId ? learnVideo(lesson.videoId) : undefined), [lesson]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = lesson ? `${lesson.title} | XELORA` : 'Learning center | XELORA';
  }, [lesson]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      {lesson ? (
        <>
          <Link to="/learn" className="text-xs font-semibold text-mint">← All lessons</Link>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{lesson.track} · {lesson.minutes} min read</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{lesson.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{lesson.summary}</p>
          <img src={lesson.image} alt={lesson.imageAlt} className="mt-6 h-72 w-full rounded-2xl object-cover sm:h-96" />
          <p className="mt-2 text-[11px] text-muted">Photograph via Unsplash.</p>

          <div className="mt-8 space-y-8">
            {lesson.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold">{section.heading}</h2>
                <div className="mt-3 space-y-4 text-sm leading-7 text-ink/90">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {lesson.example ? (
            <section className="panel mt-8 p-5">
              <h2 className="text-lg font-semibold">{lesson.example.title}</h2>
              <dl className="mt-4 divide-y divide-line">
                {lesson.example.rows.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="text-end font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-muted">{lesson.example.note}</p>
            </section>
          ) : null}

          {video ? (
            <section className="mt-8">
              <h2 className="text-lg font-semibold">Watch with this lesson</h2>
              <p className="mt-2 text-sm text-muted">{video.title} · {video.channel}</p>
              <div className="mt-3">
                <VideoFrame id={video.id} title={`${video.title} by ${video.channel}`} />
              </div>
            </section>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {lesson.practice ? <Link to={lesson.practice.to} className="mint-btn">{lesson.practice.label}</Link> : null}
            <a href={lesson.sourceUrl} className="ghost-btn" target="_blank" rel="noopener noreferrer">{lesson.sourceLabel}</a>
          </div>

          {related.length ? (
            <div className="mt-10">
              <h2 className="text-lg font-semibold">More in {lesson.track}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <Link key={item.slug} to={`/learn/${item.slug}`} className="panel overflow-hidden">
                    <img src={item.image} alt={item.imageAlt} className="h-32 w-full object-cover" />
                    <p className="p-3 text-sm font-semibold">{item.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <h1 className="text-4xl font-semibold">Lesson not found</h1>
          <p className="mt-3 text-sm text-muted">That lesson is not in the learning center.</p>
          <Link to="/learn" className="mint-btn mt-6">Back to lessons</Link>
        </>
      )}
    </section>
  );
}
