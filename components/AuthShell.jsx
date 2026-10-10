import SafeImage from "./SafeImage";
import Logo from "./Logo";
import { SITE_IMAGES } from "@/data/images";
import { CATEGORIES } from "@/data/seed";

const POINTS = ["🌱 Fresh from local farms", "🤝 Fair prices for growers", "🔒 Secure checkout"];

const CATEGORY_IMAGE = CATEGORIES.map((c) => c.image).find(Boolean) || "";
const PANEL_IMAGE = SITE_IMAGES.auth || CATEGORY_IMAGE;
const PANEL_FALLBACK = PANEL_IMAGE === CATEGORY_IMAGE ? undefined : CATEGORY_IMAGE || undefined;

export default function AuthShell({ title, subtitle, top, children }) {
  return (
    <div className="grid min-h-[calc(100vh-100px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 lg:block">
        {PANEL_IMAGE && (
          <SafeImage src={PANEL_IMAGE} fallbackSrc={PANEL_FALLBACK} alt="Fresh produce harvested on a local farm" priority sizes="(min-width: 1024px) 50vw, 1px" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-brand-900/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">From Local Farms<br />to Your Door.</h2>
          <p className="mt-3 max-w-md text-brand-100">Join a community of growers and food lovers building a fresher, fairer food system.</p>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {POINTS.map((p) => <li key={p} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{p}</li>)}
          </ul>
        </div>
      </div>
      <div className="flex items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          {top}
          <h1 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
          <div className="mt-6 sm:mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
