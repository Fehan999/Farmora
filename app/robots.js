import { PRIVATE_PATHS, SITE_URL } from "@/lib/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
