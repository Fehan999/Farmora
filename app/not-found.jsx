import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { PAGE_IMAGES } from "@/data/images";

const image = PAGE_IMAGES.notFound || PAGE_IMAGES.shop;

export default function NotFound() {
  return (
    <div className="container-x py-16 sm:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-xl">
          {image ? (
            <SafeImage src={image} alt="An empty farm field waiting for the next harvest" priority sizes="(max-width: 768px) 92vw, 480px" className="h-72 w-full object-cover sm:h-96" />
          ) : (
            <div className="grid h-72 place-items-center text-8xl sm:h-96">🌾</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-transparent" />
          <span className="badge absolute bottom-5 left-5 bg-white/90 px-3 py-1 text-brand-800 shadow">🌱 Nothing growing here yet</span>
        </div>
        <div className="text-center md:text-left">
          <p className="font-semibold text-earth-600">Page not found</p>
          <h1 className="mt-1 font-display text-5xl font-bold text-brand-900">404</h1>
          <p className="mt-2 text-gray-500">Looks like this field is empty. The page you're looking for doesn't exist.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/" className="btn-primary">Back home</Link>
            <Link href="/shop" className="btn-outline">Browse the shop</Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm md:justify-start">
            {[["/categories", "Categories"], ["/farmers", "Our farmers"], ["/track", "Track an order"], ["/contact", "Contact us"]].map(([href, label]) => (
              <Link key={href} href={href} className="font-medium text-brand-700 hover:underline">{label} →</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
