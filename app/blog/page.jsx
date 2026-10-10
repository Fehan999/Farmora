import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { BLOG_IMAGES, PAGE_IMAGES } from "@/data/images";
import { CATEGORIES, PRODUCTS } from "@/data/seed";

export const metadata = { title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", alternates: { canonical: "/blog" }, openGraph: { type: "website", siteName: "Farmora", locale: "en_US", url: "/blog", title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", images: ["/opengraph-image"] }, twitter: { card: "summary_large_image", title: "Blog — Seasonal Recipes & Farmer Stories", description: "Kitchen tips, seasonal eating guides and stories from the local farmers who grow Farmora's fresh produce, dairy, honey and bread.", creator: "Ehan Siddique", images: ["/twitter-image"] } };

const productImage = (id) => PRODUCTS.find((p) => p.id === id)?.image || "";
const categoryImage = (slug) => CATEGORIES.find((c) => c.slug === slug)?.image || "";

const POSTS = [
  { t: "10 Ways to Keep Your Greens Fresh for Longer", c: "Kitchen tips", d: "Sep 28, 2025", r: "4 min read", x: "Simple storage tricks that keep spinach, lettuce and herbs crisp all week.", f: productImage("p3"), a: "Fresh baby spinach leaves" },
  { t: "Why Seasonal Eating Tastes Better", c: "Food", d: "Sep 14, 2025", r: "5 min read", x: "Produce picked in season is sweeter, cheaper and more nutritious. Here's why.", f: categoryImage("fruits"), a: "Seasonal fruit at a farmers market" },
  { t: "Meet Maria from Sunrise Orchards", c: "Farmer stories", d: "Aug 30, 2025", r: "6 min read", x: "Twenty years of growing apples in the Yakima Valley, and what she's learned.", f: productImage("p9"), a: "Freshly picked apples from the orchard" },
  { t: "A Beginner's Guide to Sourdough", c: "Recipes", d: "Aug 12, 2025", r: "8 min read", x: "Daniel from Hearth & Stone shares his foolproof starter method.", f: productImage("p21"), a: "A rustic loaf of country sourdough" },
  { t: "What Regenerative Farming Really Means", c: "Sustainability", d: "Jul 25, 2025", r: "7 min read", x: "Healthy soil, healthy food. How our partner farms are restoring their land.", f: categoryImage("vegetables"), a: "Vegetables growing in healthy farm soil" },
  { t: "Raw vs. Processed Honey", c: "Food", d: "Jul 09, 2025", r: "3 min read", x: "Aisha explains what you lose when honey is heated and filtered.", f: productImage("p25"), a: "A jar of raw wildflower honey" },
].map((p, n) => ({ ...p, img: BLOG_IMAGES[n] || p.f }));

const [FEATURED, ...REST] = POSTS;

export default function Blog() {
  return (
    <>
      <PageHeader title="The Farmora Journal" subtitle="Stories from the field, recipes and tips for eating seasonally." crumbs={[{ label: "Blog" }]} image={PAGE_IMAGES.blog} imageAlt="Seasonal produce laid out on a kitchen table" />
      <div className="container-x py-12">
        <article className="card group grid overflow-hidden transition hover:shadow-lg lg:grid-cols-2">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 sm:h-80 lg:h-full lg:min-h-[22rem]">
            {FEATURED.img && <SafeImage src={FEATURED.img} alt={FEATURED.a} priority sizes="(max-width: 1024px) 92vw, 600px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
            <span className="badge absolute left-4 top-4 bg-earth-500 px-3 py-1 text-white shadow">Featured</span>
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-xs font-semibold text-earth-600">{FEATURED.c} · {FEATURED.d} · {FEATURED.r}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-900">{FEATURED.t}</h2>
            <p className="mt-3 text-gray-500">{FEATURED.x}</p>
            <p className="mt-6 text-sm text-gray-400">By the Farmora team</p>
          </div>
        </article>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REST.map((p) => (
            <article key={p.t} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
                {p.img && <SafeImage src={p.img} alt={p.a} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 400px" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                <span className="badge absolute left-3 top-3 bg-white/90 text-brand-800 shadow">{p.c}</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-earth-600">{p.d} · {p.r}</p>
                <h2 className="mt-1 text-lg font-bold">{p.t}</h2>
                <p className="mt-2 text-sm text-gray-500">{p.x}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
