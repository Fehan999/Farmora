import Link from "next/link";
import { notFound } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import { BLOG_POSTS, getPost, postAuthor, postDate, postWords, readingTime, relatedPosts } from "@/data/blog";
import { FARMERS } from "@/data/seed";
import { resize } from "@/lib/images";
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd, pageMeta, toJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

const authorUrl = (author) => (author.external ? author.href : absoluteUrl(author.href));
const publishedAt = (post) => `${post.date}T09:00:00.000Z`;

export function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  const author = postAuthor(post);
  const images = post.image ? [{ url: resize(post.image, 1200), width: 1200, alt: post.imageAlt || post.title }] : undefined;
  const base = pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    images,
    keywords: [post.category, author.name, author.role, "Farmora blog", "farm to table"],
    type: "article",
  });
  return {
    ...base,
    authors: [{ name: author.name, url: authorUrl(author) }],
    openGraph: {
      ...base.openGraph,
      publishedTime: publishedAt(post),
      modifiedTime: publishedAt(post),
      authors: [author.name],
      section: post.category,
      tags: [post.category, author.role],
    },
  };
}

function articleJsonLd(post, author) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        ...(post.image && { image: [resize(post.image, 1200)] }),
        datePublished: publishedAt(post),
        dateModified: publishedAt(post),
        articleSection: post.category,
        wordCount: postWords(post),
        inLanguage: "en-US",
        author: { "@type": "Person", name: author.name, url: authorUrl(author) },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
      },
      breadcrumbJsonLd([
        ["Home", "/"],
        ["Blog", "/blog"],
        [post.title, `/blog/${post.slug}`],
      ]),
    ],
  };
}

function AuthorLink({ author, className, children }) {
  if (author.external) {
    return <a href={author.href} target="_blank" rel="author noopener" className={className}>{children}</a>;
  }
  return <Link href={author.href} className={className}>{children}</Link>;
}

export default function BlogPost({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const author = postAuthor(post);
  const related = relatedPosts(post.slug, 3);
  const [lead, ...rest] = post.body;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(articleJsonLd(post, author)) }} />
      <article>
        <header className="border-b border-brand-100 bg-gradient-to-br from-brand-50 to-earth-50">
          <div className="container-x pb-10 pt-8 sm:pb-14 sm:pt-10">
            <div className="mx-auto max-w-3xl">
              <nav aria-label="Breadcrumb" className="mb-5 text-xs text-gray-500">
                <Link href="/" className="hover:text-brand-700">Home</Link> / <Link href="/blog" className="hover:text-brand-700">Blog</Link> / <span className="text-gray-700">{post.category}</span>
              </nav>
              <span className="badge bg-brand-100 text-brand-800">{post.category}</span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-brand-900 sm:text-5xl">{post.title}</h1>
              <p className="mt-4 text-lg text-gray-600">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <AuthorLink author={author} className="group flex items-center gap-3">
                  <Avatar src={author.avatar} name={author.name} sizes="48px" className="h-11 w-11 ring-2 ring-white" text="text-sm" />
                  <span className="text-sm">
                    <span className="block font-semibold text-gray-800 group-hover:text-brand-700">By {author.name}</span>
                    <span className="block text-gray-500">{author.role}{author.location ? ` · ${author.location}` : ""}</span>
                  </span>
                </AuthorLink>
                <p className="text-sm text-gray-500"><time dateTime={post.date}>{postDate(post)}</time> · {readingTime(post)}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container-x">
          <div className="mx-auto max-w-5xl pt-8 sm:pt-10">
            <div className="relative h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg sm:h-96 lg:h-[30rem]">
              {post.image && <SafeImage src={post.image} alt={post.imageAlt || post.title} priority sizes="(max-width: 1024px) 92vw, 1024px" className="h-full w-full object-cover" />}
            </div>
          </div>

          <div className="mx-auto max-w-2xl py-10 sm:py-14">
            <div className="space-y-6 text-[17px] leading-8 text-gray-700">
              {lead && <p className="text-lg leading-8 text-gray-800 sm:text-xl sm:leading-9">{lead}</p>}
              {rest.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center">
              <Avatar src={author.avatar} name={author.name} sizes="64px" className="h-14 w-14 shrink-0" text="text-lg" />
              <div className="flex-1 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-earth-600">Written by</p>
                <p className="mt-0.5 text-base font-bold text-gray-800">{author.name}</p>
                <p className="text-gray-500">{author.role}{author.location ? `, ${author.location}` : ""}</p>
              </div>
              <AuthorLink author={author} className="btn-outline shrink-0">{author.external ? "GitHub profile" : "Visit the farm"}</AuthorLink>
            </div>

            <div className="mt-6">
              <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:underline">← All posts</Link>
            </div>
          </div>
        </div>
      </article>

      <section className="container-x pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-800 px-6 py-10 text-center text-white sm:px-12">
          <p className="text-sm uppercase tracking-widest text-brand-300">Fresh from the farm</p>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Bring the farm to your kitchen</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">Shop vegetables, fruit, dairy, bread and honey from {FARMERS.length} local farms, delivered to your door within three days.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn bg-white text-brand-800 shadow-sm hover:bg-brand-50">Shop fresh food</Link>
            <Link href="/farmers" className="btn border border-white/40 text-white hover:bg-white/10">Meet the farmers</Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-earth-50/50">
          <div className="container-x py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">Keep reading</h2>
              <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:underline">All posts →</Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <article key={p.slug} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/blog/${p.slug}`} className="flex h-full flex-col">
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                      {p.image && <SafeImage src={p.image} alt={p.imageAlt || p.title} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                      <span className="badge absolute left-3 top-3 bg-white/90 text-brand-800 shadow">{p.category}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold text-earth-600"><time dateTime={p.date}>{postDate(p)}</time> · {readingTime(p)}</p>
                      <h3 className="mt-1 text-lg font-bold transition group-hover:text-brand-700">{p.title}</h3>
                      <p className="mt-2 text-sm text-gray-500">{p.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
