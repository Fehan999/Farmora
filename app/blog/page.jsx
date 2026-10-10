import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import Avatar from "@/components/Avatar";
import { PAGE_IMAGES } from "@/data/images";
import { BLOG_POSTS, postAuthor, postDate, readingTime } from "@/data/blog";

export const metadata = { title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", alternates: { canonical: "/blog" }, openGraph: { type: "website", siteName: "Farmora", locale: "en_US", url: "/blog", title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", creator: "Ehan Siddique", images: ["/twitter-image"] } };

const [FEATURED, ...REST] = BLOG_POSTS;

function Byline({ post }) {
  const author = postAuthor(post);
  return (
    <div className="flex items-center gap-3">
      <Avatar src={author.avatar} name={author.name} sizes="40px" className="h-9 w-9 shrink-0" text="text-xs" />
      <div className="min-w-0 text-sm">
        <p className="truncate font-semibold text-gray-800">{author.name}</p>
        <p className="truncate text-xs text-gray-500">{author.role}</p>
      </div>
    </div>
  );
}

export default function Blog() {
  return (
    <>
      <PageHeader title="The Farmora Journal" subtitle="Stories from the field, recipes and tips for eating seasonally." crumbs={[{ label: "Blog" }]} image={PAGE_IMAGES.blog} imageAlt="Seasonal produce laid out on a kitchen table" />
      <div className="container-x py-12">
        {FEATURED && (
          <article className="card group overflow-hidden transition hover:shadow-lg">
            <Link href={`/blog/${FEATURED.slug}`} className="grid lg:grid-cols-2">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 sm:h-80 lg:h-full lg:min-h-[22rem]">
                {FEATURED.image && <SafeImage src={FEATURED.image} alt={FEATURED.imageAlt} priority sizes="(max-width: 1024px) 92vw, 600px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                <span className="badge absolute left-4 top-4 bg-earth-500 px-3 py-1 text-white shadow">Latest</span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                <p className="text-xs font-semibold text-earth-600">{FEATURED.category} · <time dateTime={FEATURED.date}>{postDate(FEATURED)}</time> · {readingTime(FEATURED)}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-brand-900 transition group-hover:text-brand-700 sm:text-3xl">{FEATURED.title}</h2>
                <p className="mt-3 text-gray-500">{FEATURED.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <Byline post={FEATURED} />
                  <span className="text-sm font-semibold text-brand-700">Read the post <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span></span>
                </div>
              </div>
            </Link>
          </article>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REST.map((p) => (
            <article key={p.slug} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <Link href={`/blog/${p.slug}`} className="flex h-full flex-col">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                  {p.image && <SafeImage src={p.image} alt={p.imageAlt} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                  <span className="badge absolute left-3 top-3 bg-white/90 text-brand-800 shadow">{p.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold text-earth-600"><time dateTime={p.date}>{postDate(p)}</time> · {readingTime(p)}</p>
                  <h2 className="mt-1 text-lg font-bold transition group-hover:text-brand-700">{p.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-gray-500">{p.excerpt}</p>
                  <div className="mt-5 border-t border-gray-100 pt-4"><Byline post={p} /></div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
