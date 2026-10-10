import PageHeader from "@/components/PageHeader";
import SafeImage from "@/components/SafeImage";
import { BLOG_IMAGES } from "@/data/images";

export const metadata = { title: "Blog | Farmora" };

const POSTS = [
  { t: "10 Ways to Keep Your Greens Fresh for Longer", c: "Kitchen tips", d: "Sep 28, 2025", x: "Simple storage tricks that keep spinach, lettuce and herbs crisp all week." },
  { t: "Why Seasonal Eating Tastes Better", c: "Food", d: "Sep 14, 2025", x: "Produce picked in season is sweeter, cheaper and more nutritious. Here's why." },
  { t: "Meet Maria from Sunrise Orchards", c: "Farmer stories", d: "Aug 30, 2025", x: "Twenty years of growing apples in the Yakima Valley, and what she's learned." },
  { t: "A Beginner's Guide to Sourdough", c: "Recipes", d: "Aug 12, 2025", x: "Daniel from Hearth & Stone shares his foolproof starter method." },
  { t: "What Regenerative Farming Really Means", c: "Sustainability", d: "Jul 25, 2025", x: "Healthy soil, healthy food. How our partner farms are restoring their land." },
  { t: "Raw vs. Processed Honey", c: "Food", d: "Jul 09, 2025", x: "Aisha explains what you lose when honey is heated and filtered." },
];

export default function Blog() {
  return (
    <>
      <PageHeader title="The Farmora Journal" subtitle="Stories from the field, recipes and tips for eating seasonally." crumbs={[{ label: "Blog" }]} />
      <div className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p, n) => (
          <article key={p.t} className="card overflow-hidden transition hover:shadow-lg">
            <SafeImage src={BLOG_IMAGES[n]} alt={p.t} sizes="(max-width: 640px) 90vw, 400px" className="h-48 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-semibold text-earth-600">{p.c} · {p.d}</p>
              <h2 className="mt-1 text-lg font-bold">{p.t}</h2>
              <p className="mt-2 text-sm text-gray-500">{p.x}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
