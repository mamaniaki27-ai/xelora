import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPost, blogPosts } from '../../data/blog';

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogArticle() {
  const params = useParams();
  const slug = String(params.slug ?? '');
  const post = useMemo(() => blogPost(slug), [slug]);
  const related = useMemo(
    () => blogPosts.filter((item) => item.slug !== post?.slug && item.category === post?.category).slice(0, 2),
    [post],
  );

  if (!post) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Post not found</h1>
        <p className="mt-3 text-sm text-muted">That article is not on the desk.</p>
        <Link to="/blog" className="mint-btn mt-6">Back to the blog</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link to="/blog" className="text-xs font-semibold text-mint">← All posts</Link>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{post.category}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-muted">{formatDate(post.date)} · XELORA Research</p>
      <img src={post.image} alt={post.imageAlt} className="mt-6 h-72 w-full rounded-2xl object-cover sm:h-96" />
      <p className="mt-2 text-[11px] text-muted">Photograph via Unsplash.</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-ink/90">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Background reading:{' '}
        <a href={post.sourceUrl} className="font-semibold text-mint" target="_blank" rel="noopener noreferrer">{post.sourceLabel}</a>
      </p>
      {related.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">More in {post.category}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} to={`/blog/${item.slug}`} className="panel overflow-hidden">
                <img src={item.image} alt={item.imageAlt} className="h-32 w-full object-cover" />
                <p className="p-3 text-sm font-semibold">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
