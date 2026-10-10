import { money, SHIPPING_FEE } from "@/lib/format";
import { resize } from "@/lib/images";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://farmora-smoky.vercel.app").replace(/\/+$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const SITE_NAME = "Farmora";
export const SITE_TAGLINE = "From Local Farms to Your Door";
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE} | by Ehan Siddique`;
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;
export const SITE_DESCRIPTION =
  "Farmora is a full-stack farm-to-table marketplace designed and developed by Ehan Siddique. Shop fresh organic vegetables, fruit, dairy, bakery, honey and meat straight from verified local farmers, with live 3-day delivery tracking. Built with Next.js, React, Firebase, Supabase and Tailwind CSS.";
export const THEME_COLOR = "#2b7031";
export const REPO_URL = "https://github.com/Fehan999/Farmora";

export const AUTHOR = {
  name: "Ehan Siddique",
  url: "https://github.com/Fehan999",
  github: "https://github.com/Fehan999",
  jobTitle: "Full-Stack Web Developer",
};

export const KEYWORDS = [
  "Ehan Siddique",
  "Ehan Siddique developer",
  "Ehan Siddique portfolio",
  "Ehan Siddique Next.js",
  "Ehan Siddique web developer",
  "Farmora",
  "Farmora marketplace",
  "farm to table",
  "local farmers marketplace",
  "organic grocery delivery",
  "fresh produce delivery",
  "Next.js e-commerce",
  "React",
  "Firebase",
  "Supabase",
  "Tailwind CSS",
];

export const OG_ALT = "Farmora — From Local Farms to Your Door. Designed & Developed by Ehan Siddique";
export const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT };
export const TWITTER_IMAGE = { url: "/twitter-image", width: 1200, height: 630, alt: OG_ALT };

export const PRIVATE_PATHS = ["/cart", "/checkout", "/orders", "/account", "/admin", "/farmer/", "/wishlist", "/forgot-password"];

export const NOINDEX = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

export const absoluteUrl = (path = "/") =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

export function clip(text = "", max = 160) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

export function pageMeta({ title, description = SITE_DESCRIPTION, path = "/", images, keywords, noindex = false, type = "website" }) {
  const desc = clip(description);
  const ogImages = images?.length ? images : [OG_IMAGE];
  const twImages = images?.length ? images : [TWITTER_IMAGE];
  return {
    title,
    description: desc,
    ...(keywords?.length && { keywords: [...keywords, ...KEYWORDS.slice(0, 6)] }),
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE_NAME, locale: "en_US", url: path, title, description: desc, images: ogImages },
    twitter: { card: "summary_large_image", title, description: desc, creator: AUTHOR.name, images: twImages },
    ...(noindex && { robots: NOINDEX }),
  };
}

export const toJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

const ID = {
  website: `${SITE_URL}/#website`,
  organization: `${SITE_URL}/#organization`,
  person: `${SITE_URL}/#ehan-siddique`,
  code: `${SITE_URL}/#source-code`,
};

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: "Ehan Siddique is a full-stack web developer who designed and developed Farmora, a farm-to-table marketplace built with Next.js, React, Firebase, Supabase and Tailwind CSS.",
    url: SITE_URL,
    sameAs: [AUTHOR.github],
    knowsAbout: ["Next.js", "React", "JavaScript", "Firebase", "Supabase", "Tailwind CSS", "Full-Stack Web Development", "E-commerce Development", "UI/UX Design"],
  };
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ID.organization,
    name: SITE_NAME,
    url: SITE_URL,
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    image: absoluteUrl(OG_IMAGE.url),
    founder: { "@type": "Person", "@id": ID.person, name: AUTHOR.name, url: SITE_URL, sameAs: [AUTHOR.github] },
    sameAs: [REPO_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: `${SITE_NAME} by Ehan Siddique`,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": ID.organization },
    creator: { "@id": ID.person },
    author: { "@id": ID.person },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function sourceCodeJsonLd() {
  return {
    "@type": "SoftwareSourceCode",
    "@id": ID.code,
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Source code of Farmora, a full-stack farm-to-table e-commerce marketplace designed and developed by Ehan Siddique.",
    codeRepository: REPO_URL,
    url: SITE_URL,
    programmingLanguage: ["JavaScript", "React", "Next.js"],
    runtimePlatform: "Node.js",
    author: { "@id": ID.person },
    creator: { "@id": ID.person },
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteJsonLd(), organizationJsonLd(), personJsonLd(), sourceCodeJsonLd()],
  };
}

export const finalPriceOf = (p) => +(p.price * (1 - (p.discount || 0) / 100)).toFixed(2);

export function productImages(product, category) {
  const list = [...(product.gallery || []), product.image, category?.image].filter(Boolean).map((src) => resize(src, 1200));
  return [...new Set(list)];
}

export function productDescription(product, farmer) {
  const from = farmer ? ` from ${farmer.name}${farmer.location ? ` in ${farmer.location}` : ""}` : "";
  return clip(`${product.name}${from} — ${money(finalPriceOf(product))} per ${product.unit}${product.organic ? ", organic" : ""}. ${product.description || ""}`);
}

export function productJsonLd(product, farmer, category) {
  const url = absoluteUrl(`/product/${product.id}`);
  const images = productImages(product, category);
  const year = new Date().getFullYear() + 1;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: product.description || productDescription(product, farmer),
        sku: product.id,
        url,
        image: images.length ? images : [absoluteUrl(OG_IMAGE.url)],
        ...(category && { category: category.name }),
        brand: { "@type": "Brand", name: farmer?.name || SITE_NAME },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: finalPriceOf(product).toFixed(2),
          priceValidUntil: `${year}-12-31`,
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: farmer?.name || SITE_NAME },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: SHIPPING_FEE, currency: "USD" },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
            },
          },
        },
        ...(product.rating && product.reviewsCount && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
      breadcrumbJsonLd([
        ["Home", "/"],
        ["Shop", "/shop"],
        ...(category ? [[category.name, `/shop?category=${category.slug}`]] : []),
        [product.name, `/product/${product.id}`],
      ]),
    ],
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absoluteUrl(path) })),
  };
}
